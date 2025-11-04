//
//  WorkoutSessionView.swift
//  FitnessApp Watch App
//
//  Active workout session view
//

import SwiftUI

struct WorkoutSessionView: View {
    @EnvironmentObject var workoutManager: WorkoutManager
    @Environment(\.dismiss) var dismiss
    
    let workoutType: WorkoutType
    
    @State private var selectedMetricPage = 0
    @State private var showingPauseMenu = false
    @State private var showingSummary = false
    
    var body: some View {
        ZStack {
            if workoutManager.workoutState == .ended {
                SummaryView()
            } else {
                VStack(spacing: 0) {
                    // Metrics (swipeable)
                    TabView(selection: $selectedMetricPage) {
                        metricsPage1
                            .tag(0)
                        
                        metricsPage2
                            .tag(1)
                        
                        if workoutType.usesGPS {
                            metricsPage3
                                .tag(2)
                        }
                        
                        heartRateZonePage
                            .tag(3)
                    }
                    .tabViewStyle(.page)
                    
                    // Controls
                    controlButtons
                }
                .navigationBarBackButtonHidden(true)
                
                // Pause overlay
                if showingPauseMenu {
                    PauseView(
                        isPresented: $showingPauseMenu,
                        onResume: resumeWorkout,
                        onEnd: endWorkout
                    )
                }
            }
        }
        .onAppear {
            // Keep screen awake during workout
            WKInterfaceDevice.current().isBatteryMonitoringEnabled = true
        }
    }
    
    // MARK: - Metrics Pages
    
    private var metricsPage1: some View {
        VStack(spacing: 20) {
            // Duration
            VStack(spacing: 4) {
                Text("Duration")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Text(workoutManager.currentSession?.durationFormatted ?? "00:00")
                    .font(.system(size: 40, weight: .bold, design: .rounded))
            }
            
            // Heart Rate
            VStack(spacing: 4) {
                HStack(spacing: 4) {
                    Image(systemName: "heart.fill")
                        .foregroundColor(.red)
                    Text("Heart Rate")
                }
                .font(.caption)
                .foregroundColor(.secondary)
                
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("\(workoutManager.currentSession?.currentHeartRate ?? 0)")
                        .font(.system(size: 32, weight: .semibold, design: .rounded))
                    Text("BPM")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                // Heart rate zone indicator
                if let session = workoutManager.currentSession {
                    Text(session.currentZone.name)
                        .font(.caption2)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 2)
                        .background(Color.forHeartRateZone(session.currentZone).opacity(0.3))
                        .cornerRadius(4)
                }
            }
        }
    }
    
    private var metricsPage2: some View {
        VStack(spacing: 20) {
            // Calories
            VStack(spacing: 4) {
                HStack(spacing: 4) {
                    Image(systemName: "flame.fill")
                        .foregroundColor(.orange)
                    Text("Calories")
                }
                .font(.caption)
                .foregroundColor(.secondary)
                
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("\(Int(workoutManager.currentSession?.calories ?? 0))")
                        .font(.system(size: 32, weight: .semibold, design: .rounded))
                    Text("cal")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            // Distance
            if workoutType.usesGPS {
                VStack(spacing: 4) {
                    HStack(spacing: 4) {
                        Image(systemName: "figure.walk")
                            .foregroundColor(.green)
                        Text("Distance")
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                    
                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text(String(format: "%.2f", (workoutManager.currentSession?.distance ?? 0) / 1000))
                            .font(.system(size: 32, weight: .semibold, design: .rounded))
                        Text("km")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
    }
    
    private var metricsPage3: some View {
        VStack(spacing: 20) {
            // Pace
            VStack(spacing: 4) {
                Text("Pace")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Text(workoutManager.currentSession?.paceFormatted ?? "--:--")
                    .font(.system(size: 32, weight: .semibold, design: .rounded))
            }
            
            // Elevation
            VStack(spacing: 4) {
                HStack(spacing: 4) {
                    Image(systemName: "arrow.up.right")
                        .foregroundColor(.blue)
                    Text("Elevation")
                }
                .font(.caption)
                .foregroundColor(.secondary)
                
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("\(Int(workoutManager.currentSession?.elevationGain ?? 0))")
                        .font(.system(size: 32, weight: .semibold, design: .rounded))
                    Text("m")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
        }
    }
    
    private var heartRateZonePage: some View {
        VStack(spacing: 12) {
            Text("Heart Rate Zones")
                .font(.caption)
                .foregroundColor(.secondary)
            
            // Simple zone bars (could be enhanced with actual time in zone data)
            ForEach(HeartRateZone.allCases.reversed(), id: \.self) { zone in
                HStack(spacing: 8) {
                    Text(zone.name)
                        .font(.caption2)
                        .frame(width: 60, alignment: .leading)
                    
                    GeometryReader { geometry in
                        ZStack(alignment: .leading) {
                            Rectangle()
                                .fill(Color.forHeartRateZone(zone).opacity(0.2))
                            
                            Rectangle()
                                .fill(Color.forHeartRateZone(zone))
                                .frame(width: geometry.size.width * 0.3) // Placeholder
                        }
                    }
                    .frame(height: 8)
                    .cornerRadius(4)
                }
            }
        }
        .padding()
    }
    
    // MARK: - Controls
    
    private var controlButtons: some View {
        HStack(spacing: 20) {
            // Pause/Resume Button
            Button(action: {
                if workoutManager.workoutState == .running {
                    pauseWorkout()
                } else if workoutManager.workoutState == .paused {
                    resumeWorkout()
                }
            }) {
                Image(systemName: workoutManager.workoutState == .running ? "pause.fill" : "play.fill")
                    .font(.title2)
                    .foregroundColor(.white)
                    .frame(width: 50, height: 50)
                    .background(Color.orange)
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
            
            // End Button
            Button(action: {
                showingPauseMenu = true
            }) {
                Image(systemName: "stop.fill")
                    .font(.title2)
                    .foregroundColor(.white)
                    .frame(width: 50, height: 50)
                    .background(Color.red)
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
        }
        .padding(.bottom, 8)
    }
    
    // MARK: - Actions
    
    private func pauseWorkout() {
        workoutManager.pauseWorkout()
    }
    
    private func resumeWorkout() {
        workoutManager.resumeWorkout()
        showingPauseMenu = false
    }
    
    private func endWorkout() {
        Task {
            do {
                try await workoutManager.endWorkout()
                showingPauseMenu = false
            } catch {
                print("Failed to end workout: \(error)")
            }
        }
    }
}

#Preview {
    WorkoutSessionView(workoutType: .running)
        .environmentObject(WorkoutManager.shared)
}
