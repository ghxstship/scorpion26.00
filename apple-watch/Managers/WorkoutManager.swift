//
//  WorkoutManager.swift
//  FitnessApp Watch App
//
//  Manages workout session lifecycle and metrics
//

import Foundation
import HealthKit
import Combine

class WorkoutManager: NSObject, ObservableObject {
    static let shared = WorkoutManager()
    
    // MARK: - Published Properties
    @Published var currentSession: WorkoutSession?
    @Published var isWorkoutActive = false
    @Published var workoutState: WorkoutState = .idle
    
    // MARK: - Private Properties
    private let healthStore = HKHealthStore()
    private var workoutBuilder: HKWorkoutBuilder?
    private var workoutSession: HKWorkoutSession?
    private var timer: Timer?
    private var startDate: Date?
    private var pausedDuration: TimeInterval = 0
    private var lastPauseDate: Date?
    
    enum WorkoutState {
        case idle
        case running
        case paused
        case ended
    }
    
    // MARK: - Initialization
    private override init() {
        super.init()
    }
    
    // MARK: - Workout Control
    
    func startWorkout(type: WorkoutType) async throws {
        // Create workout configuration
        let configuration = HKWorkoutConfiguration()
        configuration.activityType = type.hkWorkoutType
        configuration.locationType = type.usesGPS ? .outdoor : .indoor
        
        // Create workout session
        let session = try HKWorkoutSession(healthStore: healthStore, configuration: configuration)
        let builder = session.associatedWorkoutBuilder()
        
        // Set data source
        builder.dataSource = HKLiveWorkoutDataSource(
            healthStore: healthStore,
            workoutConfiguration: configuration
        )
        
        // Set delegates
        session.delegate = self
        builder.delegate = self
        
        // Store references
        self.workoutSession = session
        self.workoutBuilder = builder
        
        // Create session model
        let workoutSession = WorkoutSession(workoutType: type)
        
        await MainActor.run {
            self.currentSession = workoutSession
            self.isWorkoutActive = true
            self.workoutState = .running
        }
        
        // Start session
        let startDate = Date()
        self.startDate = startDate
        
        session.startActivity(with: startDate)
        try await builder.beginCollection(at: startDate)
        
        // Start timer for duration updates
        startTimer()
        
        // Trigger haptic feedback
        HapticManager.shared.playStart()
    }
    
    func pauseWorkout() {
        guard let session = workoutSession, workoutState == .running else { return }
        
        session.pause()
        lastPauseDate = Date()
        workoutState = .paused
        currentSession?.pause()
        
        // Stop timer
        timer?.invalidate()
        timer = nil
        
        HapticManager.shared.playPause()
    }
    
    func resumeWorkout() {
        guard let session = workoutSession, workoutState == .paused else { return }
        
        session.resume()
        
        // Add paused duration
        if let pauseDate = lastPauseDate {
            pausedDuration += Date().timeIntervalSince(pauseDate)
        }
        
        workoutState = .running
        currentSession?.resume()
        
        // Restart timer
        startTimer()
        
        HapticManager.shared.playResume()
    }
    
    func endWorkout() async throws {
        guard let session = workoutSession, let builder = workoutBuilder else { return }
        
        // End session
        let endDate = Date()
        session.end()
        try await builder.endCollection(at: endDate)
        
        // Finalize workout
        let workout = try await builder.finishWorkout()
        
        // Update session
        await MainActor.run {
            currentSession?.end()
            workoutState = .ended
        }
        
        // Stop timer
        timer?.invalidate()
        timer = nil
        
        // Save to HealthKit
        try await saveWorkoutToHealthKit(workout)
        
        // Sync to backend
        if let session = currentSession {
            await syncWorkoutToBackend(session)
        }
        
        HapticManager.shared.playEnd()
    }
    
    func discardWorkout() {
        workoutSession?.end()
        workoutBuilder?.discardWorkout()
        
        timer?.invalidate()
        timer = nil
        
        currentSession = nil
        isWorkoutActive = false
        workoutState = .idle
        
        resetState()
    }
    
    // MARK: - Timer
    
    private func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.updateDuration()
        }
    }
    
    private func updateDuration() {
        guard let startDate = startDate, workoutState == .running else { return }
        
        let elapsed = Date().timeIntervalSince(startDate) - pausedDuration
        
        DispatchQueue.main.async {
            self.currentSession?.updateDuration(elapsed)
        }
    }
    
    // MARK: - HealthKit Integration
    
    private func saveWorkoutToHealthKit(_ workout: HKWorkout) async throws {
        try await healthStore.save(workout)
    }
    
    // MARK: - Backend Sync
    
    private func syncWorkoutToBackend(_ session: WorkoutSession) async {
        do {
            try await APIManager.shared.uploadWorkout(session)
            
            // Also send via WatchConnectivity
            ConnectivityManager.shared.sendWorkout(session)
        } catch {
            print("Failed to sync workout: \(error)")
            // Queue for later retry
            queueWorkoutForSync(session)
        }
    }
    
    private func queueWorkoutForSync(_ session: WorkoutSession) {
        // TODO: Implement CoreData queue
    }
    
    // MARK: - State Reset
    
    private func resetState() {
        startDate = nil
        pausedDuration = 0
        lastPauseDate = nil
        workoutSession = nil
        workoutBuilder = nil
    }
}

// MARK: - HKWorkoutSessionDelegate

extension WorkoutManager: HKWorkoutSessionDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
        DispatchQueue.main.async {
            switch toState {
            case .running:
                self.workoutState = .running
            case .paused:
                self.workoutState = .paused
            case .ended:
                self.workoutState = .ended
                self.isWorkoutActive = false
            default:
                break
            }
        }
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
        print("Workout session failed: \(error)")
        DispatchQueue.main.async {
            self.discardWorkout()
        }
    }
}

// MARK: - HKLiveWorkoutBuilderDelegate

extension WorkoutManager: HKLiveWorkoutBuilderDelegate {
    func workoutBuilder(_ workoutBuilder: HKWorkoutBuilder, didCollectDataOf collectedTypes: Set<HKSampleType>) {
        for type in collectedTypes {
            guard let quantityType = type as? HKQuantityType else { continue }
            
            let statistics = workoutBuilder.statistics(for: quantityType)
            updateMetrics(for: quantityType, statistics: statistics)
        }
    }
    
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKWorkoutBuilder) {
        // Handle workout events
    }
    
    private func updateMetrics(for type: HKQuantityType, statistics: HKStatistics?) {
        guard let statistics = statistics else { return }
        
        DispatchQueue.main.async {
            switch type {
            case HKQuantityType.quantityType(forIdentifier: .heartRate):
                if let heartRate = statistics.mostRecentQuantity()?.doubleValue(for: .count().unitDivided(by: .minute())) {
                    self.currentSession?.updateHeartRate(Int(heartRate))
                }
                
            case HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned):
                if let calories = statistics.sumQuantity()?.doubleValue(for: .kilocalorie()) {
                    self.currentSession?.updateCalories(calories)
                }
                
            case HKQuantityType.quantityType(forIdentifier: .distanceWalkingRunning),
                 HKQuantityType.quantityType(forIdentifier: .distanceCycling):
                if let distance = statistics.sumQuantity()?.doubleValue(for: .meter()) {
                    self.currentSession?.updateDistance(distance)
                }
                
            default:
                break
            }
        }
    }
}
