//
//  ContentView.swift
//  FitnessApp Watch App
//
//  Root navigation view
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var workoutManager: WorkoutManager
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tag(0)
            
            WorkoutListView()
                .tag(1)
            
            SettingsView()
                .tag(2)
        }
        .tabViewStyle(.page)
    }
}

#Preview {
    ContentView()
        .environmentObject(WorkoutManager.shared)
        .environmentObject(HealthKitManager.shared)
        .environmentObject(ConnectivityManager.shared)
}
