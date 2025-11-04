//
//  QuickStartView.swift
//  FitnessApp Watch App
//
//  Quick start workout buttons
//

import SwiftUI

struct QuickStartView: View {
    @EnvironmentObject var workoutManager: WorkoutManager
    @State private var showingWorkoutSession = false
    @State private var selectedWorkoutType: WorkoutType?
    
    // Most common workout types for quick access
    private let quickWorkouts: [WorkoutType] = [
        .running,
        .cycling,
        .strength
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Start")
                .font(.headline)
            
            ForEach(quickWorkouts, id: \.self) { workoutType in
                Button(action: {
                    startWorkout(type: workoutType)
                }) {
                    HStack {
                        Image(systemName: workoutType.icon)
                            .font(.title3)
                            .frame(width: 30)
                        
                        Text(workoutType.rawValue)
                            .font(.body)
                        
                        Spacer()
                        
                        Image(systemName: "play.fill")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding(.vertical, 8)
                    .padding(.horizontal, 12)
                    .background(Color.accentColor.opacity(0.1))
                    .cornerRadius(8)
                }
                .buttonStyle(.plain)
            }
        }
        .sheet(isPresented: $showingWorkoutSession) {
            if let workoutType = selectedWorkoutType {
                WorkoutSessionView(workoutType: workoutType)
            }
        }
    }
    
    private func startWorkout(type: WorkoutType) {
        selectedWorkoutType = type
        showingWorkoutSession = true
        
        Task {
            do {
                try await workoutManager.startWorkout(type: type)
            } catch {
                print("Failed to start workout: \(error)")
            }
        }
    }
}

#Preview {
    QuickStartView()
        .environmentObject(WorkoutManager.shared)
}
