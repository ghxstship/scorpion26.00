//
//  SettingsView.swift
//  FitnessApp Watch App
//
//  App settings
//

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var healthKitManager: HealthKitManager
    @EnvironmentObject var connectivityManager: ConnectivityManager
    
    @State private var showingHealthKitAuth = false
    
    var body: some View {
        List {
            // HealthKit Section
            Section("Health") {
                HStack {
                    Image(systemName: "heart.fill")
                        .foregroundColor(.red)
                    Text("HealthKit")
                    Spacer()
                    Image(systemName: healthKitManager.isAuthorized ? "checkmark.circle.fill" : "xmark.circle.fill")
                        .foregroundColor(healthKitManager.isAuthorized ? .green : .red)
                }
                
                if !healthKitManager.isAuthorized {
                    Button("Enable HealthKit") {
                        Task {
                            await healthKitManager.requestAuthorization()
                        }
                    }
                }
            }
            
            // Connectivity Section
            Section("iPhone") {
                HStack {
                    Image(systemName: "iphone")
                    Text("Connection")
                    Spacer()
                    Circle()
                        .fill(connectivityManager.isReachable ? Color.green : Color.red)
                        .frame(width: 8, height: 8)
                }
                
                if !connectivityManager.isReachable {
                    Text("iPhone not reachable")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Button("Sync Now") {
                    connectivityManager.requestWorkoutLibrary()
                    connectivityManager.requestUserStats()
                    connectivityManager.syncQueuedWorkouts()
                }
                .disabled(!connectivityManager.isReachable)
            }
            
            // Battery Section
            Section("Battery") {
                HStack {
                    Image(systemName: "battery.100")
                        .foregroundColor(batteryColor)
                    Text("Battery Level")
                    Spacer()
                    Text("\(Int(WKInterfaceDevice.current().batteryLevel * 100))%")
                        .foregroundColor(.secondary)
                }
                
                if WKInterfaceDevice.current().isLowBattery {
                    Text("Low battery mode recommended")
                        .font(.caption)
                        .foregroundColor(.orange)
                }
            }
            
            // About Section
            Section("About") {
                HStack {
                    Text("Version")
                    Spacer()
                    Text("1.0.0")
                        .foregroundColor(.secondary)
                }
                
                HStack {
                    Text("Build")
                    Spacer()
                    Text("1")
                        .foregroundColor(.secondary)
                }
            }
        }
        .navigationTitle("Settings")
    }
    
    private var batteryColor: Color {
        let level = WKInterfaceDevice.current().batteryLevel
        if level < 0.2 {
            return .red
        } else if level < 0.5 {
            return .orange
        } else {
            return .green
        }
    }
}

#Preview {
    NavigationStack {
        SettingsView()
            .environmentObject(HealthKitManager.shared)
            .environmentObject(ConnectivityManager.shared)
    }
}
