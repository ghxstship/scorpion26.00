//
//  HomeView.swift
//  FitnessApp Watch App
//
//  Main dashboard view
//

import SwiftUI

struct HomeView: View {
    @EnvironmentObject var healthKitManager: HealthKitManager
    @EnvironmentObject var connectivityManager: ConnectivityManager
    @EnvironmentObject var workoutManager: WorkoutManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Header
                headerSection
                
                // Activity Rings
                ActivityRingsView()
                    .frame(height: 120)
                
                // Today's Stats
                todayStatsSection
                
                // Quick Start Workouts
                QuickStartView()
                
                // Current Streak
                if let stats = connectivityManager.userStats {
                    streakSection(stats: stats)
                }
            }
            .padding()
        }
        .navigationTitle("Home")
        .onAppear {
            Task {
                await healthKitManager.fetchTodayMetrics()
            }
        }
    }
    
    // MARK: - Header
    
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Today")
                .font(.headline)
            
            Text(Date().formatted(style: .long))
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
    
    // MARK: - Today's Stats
    
    private var todayStatsSection: some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                statCard(
                    icon: "heart.fill",
                    value: "\(healthKitManager.todayMetrics.heartRate)",
                    unit: "BPM",
                    color: .red
                )
                
                statCard(
                    icon: "flame.fill",
                    value: "\(Int(healthKitManager.todayMetrics.calories))",
                    unit: "cal",
                    color: .orange
                )
            }
            
            HStack(spacing: 12) {
                statCard(
                    icon: "figure.walk",
                    value: String(format: "%.1f", healthKitManager.todayMetrics.distance / 1000),
                    unit: "km",
                    color: .green
                )
                
                statCard(
                    icon: "shoeprints.fill",
                    value: "\(healthKitManager.todayMetrics.steps)",
                    unit: "steps",
                    color: .blue
                )
            }
        }
    }
    
    private func statCard(icon: String, value: String, unit: String, color: Color) -> some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(color)
            
            Text(value)
                .font(.title3)
                .fontWeight(.bold)
            
            Text(unit)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(Color.secondary.opacity(0.1))
        .cornerRadius(8)
    }
    
    // MARK: - Streak Section
    
    private func streakSection(stats: UserStats) -> some View {
        HStack {
            Image(systemName: "flame.fill")
                .font(.title2)
                .foregroundColor(.orange)
            
            VStack(alignment: .leading, spacing: 2) {
                Text("\(stats.currentStreak) Day Streak")
                    .font(.headline)
                
                Text("\(stats.totalWorkouts) total workouts")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
        .padding()
        .background(Color.orange.opacity(0.1))
        .cornerRadius(12)
    }
}

#Preview {
    NavigationStack {
        HomeView()
            .environmentObject(WorkoutManager.shared)
            .environmentObject(HealthKitManager.shared)
            .environmentObject(ConnectivityManager.shared)
    }
}
