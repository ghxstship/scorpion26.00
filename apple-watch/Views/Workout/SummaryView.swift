//
//  SummaryView.swift
//  FitnessApp Watch App
//
//  Workout completion summary
//

import SwiftUI

struct SummaryView: View {
    @EnvironmentObject var workoutManager: WorkoutManager
    @Environment(\.dismiss) var dismiss
    
    @State private var rating: Int = 0
    @State private var showingSuccess = true
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Success Animation
                if showingSuccess {
                    VStack(spacing: 8) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 50))
                            .foregroundColor(.green)
                            .scaleEffect(showingSuccess ? 1 : 0.5)
                            .animation(.spring(response: 0.5, dampingFraction: 0.6), value: showingSuccess)
                        
                        Text("Workout Complete!")
                            .font(.headline)
                    }
                    .padding(.top)
                }
                
                // Stats Summary
                if let session = workoutManager.currentSession {
                    VStack(spacing: 16) {
                        // Duration
                        statRow(
                            icon: "clock.fill",
                            label: "Duration",
                            value: session.durationFormatted,
                            color: .blue
                        )
                        
                        // Calories
                        statRow(
                            icon: "flame.fill",
                            label: "Calories",
                            value: session.caloriesFormatted,
                            color: .orange
                        )
                        
                        // Distance (if applicable)
                        if session.distance > 0 {
                            statRow(
                                icon: "figure.walk",
                                label: "Distance",
                                value: session.distanceFormatted,
                                color: .green
                            )
                        }
                        
                        // Average Heart Rate
                        if session.averageHeartRate > 0 {
                            statRow(
                                icon: "heart.fill",
                                label: "Avg Heart Rate",
                                value: "\(session.averageHeartRate) BPM",
                                color: .red
                            )
                        }
                        
                        // Max Heart Rate
                        if session.maxHeartRate > 0 {
                            statRow(
                                icon: "heart.fill",
                                label: "Max Heart Rate",
                                value: "\(session.maxHeartRate) BPM",
                                color: .red
                            )
                        }
                        
                        // Pace (if applicable)
                        if session.pace > 0 {
                            statRow(
                                icon: "speedometer",
                                label: "Avg Pace",
                                value: session.paceFormatted,
                                color: .purple
                            )
                        }
                    }
                    .padding(.horizontal)
                    
                    // Rating
                    VStack(spacing: 8) {
                        Text("Rate Your Workout")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        HStack(spacing: 8) {
                            ForEach(1...5, id: \.self) { star in
                                Button(action: {
                                    rating = star
                                    session.setRating(star)
                                    HapticManager.shared.playSuccess()
                                }) {
                                    Image(systemName: star <= rating ? "star.fill" : "star")
                                        .font(.title3)
                                        .foregroundColor(star <= rating ? .yellow : .gray)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                    .padding()
                    .background(Color.secondary.opacity(0.1))
                    .cornerRadius(12)
                    .padding(.horizontal)
                }
                
                // Action Buttons
                VStack(spacing: 12) {
                    // Done Button
                    Button(action: {
                        saveAndDismiss()
                    }) {
                        Text("Done")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.accentColor)
                            .cornerRadius(8)
                    }
                    .buttonStyle(.plain)
                    
                    // Share Button (placeholder)
                    Button(action: {
                        // TODO: Implement share functionality
                    }) {
                        HStack {
                            Image(systemName: "square.and.arrow.up")
                            Text("Share")
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.secondary.opacity(0.2))
                        .cornerRadius(8)
                    }
                    .buttonStyle(.plain)
                }
                .padding(.horizontal)
                .padding(.bottom)
            }
        }
        .navigationBarBackButtonHidden(true)
        .onAppear {
            HapticManager.shared.playSuccess()
        }
    }
    
    // MARK: - Stat Row
    
    private func statRow(icon: String, label: String, value: String, color: Color) -> some View {
        HStack {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(color)
                .frame(width: 30)
            
            Text(label)
                .font(.body)
                .foregroundColor(.secondary)
            
            Spacer()
            
            Text(value)
                .font(.body)
                .fontWeight(.semibold)
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(Color.secondary.opacity(0.1))
        .cornerRadius(8)
    }
    
    // MARK: - Actions
    
    private func saveAndDismiss() {
        // Workout is already saved by WorkoutManager
        dismiss()
    }
}

#Preview {
    SummaryView()
        .environmentObject(WorkoutManager.shared)
}
