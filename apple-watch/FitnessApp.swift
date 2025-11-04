//
//  FitnessApp.swift
//  FitnessApp Watch App
//
//  Created for Scorpion26.00
//  watchOS 10.0+
//

import SwiftUI
import HealthKit

@main
struct FitnessApp: App {
    @StateObject private var workoutManager = WorkoutManager.shared
    @StateObject private var healthKitManager = HealthKitManager.shared
    @StateObject private var connectivityManager = ConnectivityManager.shared
    
    @SceneBuilder var body: some Scene {
        WindowGroup {
            NavigationStack {
                ContentView()
                    .environmentObject(workoutManager)
                    .environmentObject(healthKitManager)
                    .environmentObject(connectivityManager)
            }
        }
    }
    
    init() {
        // Request HealthKit authorization on app launch
        Task {
            await HealthKitManager.shared.requestAuthorization()
        }
        
        // Activate WatchConnectivity session
        ConnectivityManager.shared.activate()
    }
}
