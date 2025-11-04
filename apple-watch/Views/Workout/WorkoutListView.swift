//
//  WorkoutListView.swift
//  FitnessApp Watch App
//
//  List of available workouts
//

import SwiftUI

struct WorkoutListView: View {
    @EnvironmentObject var connectivityManager: ConnectivityManager
    @EnvironmentObject var workoutManager: WorkoutManager
    @State private var showingWorkoutSession = false
    @State private var selectedWorkout: Workout?
    
    var body: some View {
        List {
            if connectivityManager.workoutLibrary.isEmpty {
                // Show all workout types if no library loaded
                Section("All Workouts") {
                    ForEach(WorkoutType.allCases, id: \.self) { type in
                        WorkoutTypeRow(workoutType: type) {
                            startWorkout(type: type)
                        }
                    }
                }
            } else {
                // Show workout library from backend
                Section("Your Workouts") {
                    ForEach(connectivityManager.workoutLibrary) { workout in
                        WorkoutRow(workout: workout) {
                            selectedWorkout = workout
                            startWorkout(type: workout.type)
                        }
                    }
                }
            }
        }
        .navigationTitle("Workouts")
        .sheet(isPresented: $showingWorkoutSession) {
            if let workout = selectedWorkout {
                WorkoutSessionView(workoutType: workout.type)
            }
        }
        .onAppear {
            connectivityManager.requestWorkoutLibrary()
        }
    }
    
    private func startWorkout(type: WorkoutType) {
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

struct WorkoutTypeRow: View {
    let workoutType: WorkoutType
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: workoutType.icon)
                    .font(.title3)
                    .foregroundColor(.accentColor)
                    .frame(width: 30)
                
                Text(workoutType.rawValue)
                    .font(.body)
                
                Spacer()
            }
        }
    }
}

struct WorkoutRow: View {
    let workout: Workout
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Image(systemName: workout.type.icon)
                        .font(.title3)
                        .foregroundColor(.accentColor)
                    
                    Text(workout.name)
                        .font(.headline)
                }
                
                HStack {
                    Text("\(workout.durationMinutes) min")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text("•")
                        .foregroundColor(.secondary)
                    
                    Text(workout.difficulty.capitalized)
                        .font(.caption)
                        .foregroundColor(difficultyColor(workout.difficulty))
                }
            }
        }
    }
    
    private func difficultyColor(_ difficulty: String) -> Color {
        switch difficulty.lowercased() {
        case "easy": return .green
        case "moderate": return .orange
        case "hard": return .red
        default: return .secondary
        }
    }
}

#Preview {
    NavigationStack {
        WorkoutListView()
            .environmentObject(ConnectivityManager.shared)
            .environmentObject(WorkoutManager.shared)
    }
}
