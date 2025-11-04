//
//  Constants.swift
//  FitnessApp Watch App
//
//  App-wide constants
//

import Foundation
import SwiftUI

enum AppConstants {
    // MARK: - API
    static let baseURL = "https://api.scorpion26.com"
    static let apiVersion = "v1"
    
    // MARK: - User Defaults Keys
    static let authTokenKey = "auth_token"
    static let userIDKey = "user_id"
    static let lastSyncKey = "last_sync_date"
    
    // MARK: - Workout
    static let minWorkoutDuration: TimeInterval = 60 // 1 minute
    static let maxWorkoutDuration: TimeInterval = 14400 // 4 hours
    static let autoPauseThreshold: TimeInterval = 180 // 3 minutes
    
    // MARK: - Battery
    static let lowBatteryThreshold = 0.20 // 20%
    static let criticalBatteryThreshold = 0.10 // 10%
    
    // MARK: - Sync
    static let syncInterval: TimeInterval = 900 // 15 minutes
    static let maxQueuedWorkouts = 50
    
    // MARK: - Heart Rate
    static let defaultMaxHeartRate = 190
    static let heartRateSampleInterval: TimeInterval = 1.0
    
    // MARK: - Colors
    enum Colors {
        static let warmupZone = Color.gray
        static let fatBurnZone = Color.blue
        static let cardioZone = Color.green
        static let peakZone = Color.orange
        static let maximumZone = Color.red
        
        static let primary = Color.accentColor
        static let success = Color.green
        static let warning = Color.orange
        static let error = Color.red
    }
    
    // MARK: - Animations
    enum Animations {
        static let defaultDuration = 0.3
        static let springResponse = 0.5
        static let springDamping = 0.7
    }
}
