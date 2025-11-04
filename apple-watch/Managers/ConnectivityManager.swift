//
//  ConnectivityManager.swift
//  FitnessApp Watch App
//
//  Manages WatchConnectivity for iPhone sync
//

import Foundation
import WatchConnectivity
import Combine

class ConnectivityManager: NSObject, ObservableObject {
    static let shared = ConnectivityManager()
    
    // MARK: - Published Properties
    @Published var isReachable = false
    @Published var isPaired = false
    @Published var isInstalled = false
    @Published var userStats: UserStats?
    @Published var workoutLibrary: [Workout] = []
    
    // MARK: - Private Properties
    private let session: WCSession
    private var queuedWorkouts: [WorkoutSession] = []
    
    // MARK: - Initialization
    private override init() {
        self.session = WCSession.default
        super.init()
    }
    
    func activate() {
        guard WCSession.isSupported() else {
            print("WatchConnectivity is not supported")
            return
        }
        
        session.delegate = self
        session.activate()
    }
    
    // MARK: - Send Data
    
    func sendWorkout(_ workout: WorkoutSession) {
        let workoutData: [String: Any] = [
            "type": "workout_completed",
            "data": workout.toDictionary()
        ]
        
        if session.isReachable {
            // Send immediately via message
            session.sendMessage(workoutData, replyHandler: { response in
                print("Workout sent successfully: \(response)")
            }, errorHandler: { error in
                print("Failed to send workout: \(error)")
                self.queueWorkout(workout)
            })
        } else {
            // Queue for guaranteed delivery
            session.transferUserInfo(workoutData)
            print("Workout queued for transfer")
        }
    }
    
    func requestWorkoutLibrary() {
        guard session.isReachable else {
            print("iPhone not reachable")
            return
        }
        
        let message = ["type": "request_workout_library"]
        
        session.sendMessage(message, replyHandler: { [weak self] response in
            if let workoutsData = response["workouts"] as? [[String: Any]] {
                self?.parseWorkoutLibrary(workoutsData)
            }
        }, errorHandler: { error in
            print("Failed to request workout library: \(error)")
        })
    }
    
    func requestUserStats() {
        guard session.isReachable else {
            print("iPhone not reachable")
            return
        }
        
        let message = ["type": "request_user_stats"]
        
        session.sendMessage(message, replyHandler: { [weak self] response in
            if let statsData = response["stats"] as? [String: Any] {
                self?.parseUserStats(statsData)
            }
        }, errorHandler: { error in
            print("Failed to request user stats: \(error)")
        })
    }
    
    func syncQueuedWorkouts() {
        guard !queuedWorkouts.isEmpty else { return }
        
        for workout in queuedWorkouts {
            sendWorkout(workout)
        }
        
        // Clear queue after sending
        queuedWorkouts.removeAll()
    }
    
    // MARK: - Private Methods
    
    private func queueWorkout(_ workout: WorkoutSession) {
        queuedWorkouts.append(workout)
        
        // Also save to persistent storage
        // TODO: Implement CoreData persistence
    }
    
    private func parseWorkoutLibrary(_ data: [[String: Any]]) {
        var workouts: [Workout] = []
        
        for item in data {
            guard let id = item["id"] as? String,
                  let name = item["name"] as? String,
                  let typeString = item["type"] as? String,
                  let type = WorkoutType(rawValue: typeString),
                  let duration = item["duration_minutes"] as? Int,
                  let difficulty = item["difficulty"] as? String else {
                continue
            }
            
            let workout = Workout(
                id: UUID(uuidString: id) ?? UUID(),
                name: name,
                type: type,
                durationMinutes: duration,
                difficulty: difficulty,
                description: item["description"] as? String
            )
            
            workouts.append(workout)
        }
        
        DispatchQueue.main.async {
            self.workoutLibrary = workouts
        }
    }
    
    private func parseUserStats(_ data: [String: Any]) {
        guard let currentStreak = data["current_streak"] as? Int,
              let totalWorkouts = data["total_workouts"] as? Int,
              let totalCalories = data["total_calories"] as? Double,
              let totalDistance = data["total_distance"] as? Double else {
            return
        }
        
        let achievements: [UserStats.Achievement] = []
        // TODO: Parse achievements array
        
        let stats = UserStats(
            currentStreak: currentStreak,
            totalWorkouts: totalWorkouts,
            totalCalories: totalCalories,
            totalDistance: totalDistance,
            achievements: achievements
        )
        
        DispatchQueue.main.async {
            self.userStats = stats
        }
    }
}

// MARK: - WCSessionDelegate

extension ConnectivityManager: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        DispatchQueue.main.async {
            self.isPaired = session.isPaired
            self.isInstalled = session.isWatchAppInstalled
            self.isReachable = session.isReachable
        }
        
        if let error = error {
            print("WCSession activation failed: \(error)")
        } else {
            print("WCSession activated with state: \(activationState.rawValue)")
            
            // Request initial data
            requestWorkoutLibrary()
            requestUserStats()
            
            // Sync any queued workouts
            syncQueuedWorkouts()
        }
    }
    
    func sessionReachabilityDidChange(_ session: WCSession) {
        DispatchQueue.main.async {
            self.isReachable = session.isReachable
        }
        
        if session.isReachable {
            print("iPhone is now reachable")
            syncQueuedWorkouts()
        }
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
        handleMessage(message)
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
        handleMessage(message)
        replyHandler(["status": "received"])
    }
    
    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String : Any] = [:]) {
        handleMessage(userInfo)
    }
    
    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
        // Handle application context updates
        if let statsData = applicationContext["user_stats"] as? [String: Any] {
            parseUserStats(statsData)
        }
    }
    
    private func handleMessage(_ message: [String: Any]) {
        guard let type = message["type"] as? String else { return }
        
        switch type {
        case "workout_library_update":
            if let workoutsData = message["workouts"] as? [[String: Any]] {
                parseWorkoutLibrary(workoutsData)
            }
            
        case "stats_update":
            if let statsData = message["stats"] as? [String: Any] {
                parseUserStats(statsData)
            }
            
        case "achievement_unlocked":
            // Handle achievement notification
            if let achievementName = message["achievement"] as? String {
                print("Achievement unlocked: \(achievementName)")
                HapticManager.shared.playSuccess()
            }
            
        default:
            print("Unknown message type: \(type)")
        }
    }
}
