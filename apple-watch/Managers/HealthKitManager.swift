//
//  HealthKitManager.swift
//  FitnessApp Watch App
//
//  Manages HealthKit authorization and data access
//

import Foundation
import HealthKit
import Combine

class HealthKitManager: ObservableObject {
    static let shared = HealthKitManager()
    
    // MARK: - Published Properties
    @Published var isAuthorized = false
    @Published var todayMetrics = HealthMetrics()
    
    // MARK: - Private Properties
    private let healthStore = HKHealthStore()
    private var cancellables = Set<AnyCancellable>()
    
    // MARK: - Initialization
    private init() {
        checkAuthorization()
    }
    
    // MARK: - Authorization
    
    func requestAuthorization() async {
        guard HKHealthStore.isHealthDataAvailable() else {
            print("HealthKit is not available on this device")
            return
        }
        
        let typesToRead: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
            HKObjectType.quantityType(forIdentifier: .distanceCycling)!,
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.workoutType()
        ]
        
        let typesToWrite: Set<HKSampleType> = [
            HKObjectType.workoutType(),
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKObjectType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
            HKObjectType.quantityType(forIdentifier: .distanceCycling)!
        ]
        
        do {
            try await healthStore.requestAuthorization(toShare: typesToWrite, read: typesToRead)
            
            await MainActor.run {
                self.isAuthorized = true
            }
            
            // Start observing health data
            startObservingHealthData()
            
            // Fetch today's metrics
            await fetchTodayMetrics()
        } catch {
            print("HealthKit authorization failed: \(error)")
        }
    }
    
    private func checkAuthorization() {
        guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) else { return }
        
        let status = healthStore.authorizationStatus(for: heartRateType)
        isAuthorized = (status == .sharingAuthorized)
    }
    
    // MARK: - Data Fetching
    
    func fetchTodayMetrics() async {
        let calendar = Calendar.current
        let now = Date()
        let startOfDay = calendar.startOfDay(for: now)
        
        async let heartRate = fetchLatestHeartRate()
        async let calories = fetchTodayCalories(startDate: startOfDay)
        async let distance = fetchTodayDistance(startDate: startOfDay)
        async let steps = fetchTodaySteps(startDate: startOfDay)
        
        let (hr, cal, dist, st) = await (heartRate, calories, distance, steps)
        
        await MainActor.run {
            self.todayMetrics = HealthMetrics(
                heartRate: hr,
                calories: cal,
                distance: dist,
                steps: st,
                activeMinutes: 0
            )
        }
    }
    
    private func fetchLatestHeartRate() async -> Int {
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            return 0
        }
        
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        let query = HKSampleQuery(
            sampleType: heartRateType,
            predicate: nil,
            limit: 1,
            sortDescriptors: [sortDescriptor]
        ) { _, samples, error in
            // Handle in continuation
        }
        
        return await withCheckedContinuation { continuation in
            let query = HKSampleQuery(
                sampleType: heartRateType,
                predicate: nil,
                limit: 1,
                sortDescriptors: [sortDescriptor]
            ) { _, samples, error in
                guard let sample = samples?.first as? HKQuantitySample else {
                    continuation.resume(returning: 0)
                    return
                }
                
                let heartRate = sample.quantity.doubleValue(for: .count().unitDivided(by: .minute()))
                continuation.resume(returning: Int(heartRate))
            }
            
            healthStore.execute(query)
        }
    }
    
    private func fetchTodayCalories(startDate: Date) async -> Double {
        guard let caloriesType = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned) else {
            return 0
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: Date(), options: .strictStartDate)
        
        return await withCheckedContinuation { continuation in
            let query = HKStatisticsQuery(
                quantityType: caloriesType,
                quantitySamplePredicate: predicate,
                options: .cumulativeSum
            ) { _, statistics, error in
                guard let sum = statistics?.sumQuantity() else {
                    continuation.resume(returning: 0)
                    return
                }
                
                let calories = sum.doubleValue(for: .kilocalorie())
                continuation.resume(returning: calories)
            }
            
            healthStore.execute(query)
        }
    }
    
    private func fetchTodayDistance(startDate: Date) async -> Double {
        guard let distanceType = HKQuantityType.quantityType(forIdentifier: .distanceWalkingRunning) else {
            return 0
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: Date(), options: .strictStartDate)
        
        return await withCheckedContinuation { continuation in
            let query = HKStatisticsQuery(
                quantityType: distanceType,
                quantitySamplePredicate: predicate,
                options: .cumulativeSum
            ) { _, statistics, error in
                guard let sum = statistics?.sumQuantity() else {
                    continuation.resume(returning: 0)
                    return
                }
                
                let distance = sum.doubleValue(for: .meter())
                continuation.resume(returning: distance)
            }
            
            healthStore.execute(query)
        }
    }
    
    private func fetchTodaySteps(startDate: Date) async -> Int {
        guard let stepsType = HKQuantityType.quantityType(forIdentifier: .stepCount) else {
            return 0
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: Date(), options: .strictStartDate)
        
        return await withCheckedContinuation { continuation in
            let query = HKStatisticsQuery(
                quantityType: stepsType,
                quantitySamplePredicate: predicate,
                options: .cumulativeSum
            ) { _, statistics, error in
                guard let sum = statistics?.sumQuantity() else {
                    continuation.resume(returning: 0)
                    return
                }
                
                let steps = sum.doubleValue(for: .count())
                continuation.resume(returning: Int(steps))
            }
            
            healthStore.execute(query)
        }
    }
    
    // MARK: - Data Observation
    
    private func startObservingHealthData() {
        // Observe heart rate changes
        observeQuantityType(.heartRate) { [weak self] value in
            self?.todayMetrics.heartRate = Int(value)
        }
        
        // Observe calorie changes
        observeQuantityType(.activeEnergyBurned) { [weak self] value in
            self?.todayMetrics.calories = value
        }
    }
    
    private func observeQuantityType(_ identifier: HKQuantityTypeIdentifier, handler: @escaping (Double) -> Void) {
        guard let quantityType = HKQuantityType.quantityType(forIdentifier: identifier) else { return }
        
        let query = HKObserverQuery(sampleType: quantityType, predicate: nil) { [weak self] _, completionHandler, error in
            if error != nil {
                completionHandler()
                return
            }
            
            // Fetch latest value
            Task {
                await self?.fetchTodayMetrics()
            }
            
            completionHandler()
        }
        
        healthStore.execute(query)
    }
    
    // MARK: - Data Writing
    
    func saveWorkout(_ session: WorkoutSession) async throws {
        let workoutType = session.workoutType.hkWorkoutType
        let startDate = session.startedAt
        let endDate = session.endedAt ?? Date()
        
        let workout = HKWorkout(
            activityType: workoutType,
            start: startDate,
            end: endDate,
            duration: session.duration,
            totalEnergyBurned: HKQuantity(unit: .kilocalorie(), doubleValue: session.calories),
            totalDistance: HKQuantity(unit: .meter(), doubleValue: session.distance),
            metadata: [
                "rating": session.rating,
                "average_heart_rate": session.averageHeartRate,
                "max_heart_rate": session.maxHeartRate
            ]
        )
        
        try await healthStore.save(workout)
        
        // Save heart rate samples
        try await saveHeartRateSamples(session.heartRateData, startDate: startDate, duration: session.duration)
    }
    
    private func saveHeartRateSamples(_ heartRates: [Int], startDate: Date, duration: TimeInterval) async throws {
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else { return }
        
        let interval = duration / Double(heartRates.count)
        var samples: [HKQuantitySample] = []
        
        for (index, heartRate) in heartRates.enumerated() {
            let sampleDate = startDate.addingTimeInterval(interval * Double(index))
            let quantity = HKQuantity(unit: .count().unitDivided(by: .minute()), doubleValue: Double(heartRate))
            
            let sample = HKQuantitySample(
                type: heartRateType,
                quantity: quantity,
                start: sampleDate,
                end: sampleDate
            )
            
            samples.append(sample)
        }
        
        try await healthStore.save(samples)
    }
}
