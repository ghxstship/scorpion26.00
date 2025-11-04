//
//  PauseView.swift
//  FitnessApp Watch App
//
//  Pause menu overlay
//

import SwiftUI

struct PauseView: View {
    @Binding var isPresented: Bool
    let onResume: () -> Void
    let onEnd: () -> Void
    
    var body: some View {
        ZStack {
            // Semi-transparent background
            Color.black.opacity(0.8)
                .ignoresSafeArea()
            
            VStack(spacing: 20) {
                Text("Workout Paused")
                    .font(.headline)
                
                VStack(spacing: 12) {
                    // Resume Button
                    Button(action: {
                        onResume()
                    }) {
                        HStack {
                            Image(systemName: "play.fill")
                            Text("Resume")
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.green)
                        .cornerRadius(8)
                    }
                    .buttonStyle(.plain)
                    
                    // End Workout Button
                    Button(action: {
                        onEnd()
                    }) {
                        HStack {
                            Image(systemName: "stop.fill")
                            Text("End Workout")
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.red)
                        .cornerRadius(8)
                    }
                    .buttonStyle(.plain)
                    
                    // Cancel Button
                    Button(action: {
                        isPresented = false
                    }) {
                        Text("Cancel")
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.secondary.opacity(0.3))
                            .cornerRadius(8)
                    }
                    .buttonStyle(.plain)
                }
                .padding(.horizontal)
            }
        }
    }
}

#Preview {
    PauseView(
        isPresented: .constant(true),
        onResume: {},
        onEnd: {}
    )
}
