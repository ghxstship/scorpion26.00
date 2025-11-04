//
//  ActivityRingsView.swift
//  FitnessApp Watch App
//
//  Apple Health-style activity rings
//

import SwiftUI
import HealthKit

struct ActivityRingsView: View {
    @EnvironmentObject var healthKitManager: HealthKitManager
    
    // Goals (should be fetched from user settings)
    private let calorieGoal: Double = 500
    private let exerciseGoal: Double = 30 // minutes
    private let standGoal: Double = 12 // hours
    
    var body: some View {
        ZStack {
            // Move Ring (Calories)
            Ring(
                progress: healthKitManager.todayMetrics.calories / calorieGoal,
                color: .red,
                lineWidth: 12
            )
            .frame(width: 100, height: 100)
            
            // Exercise Ring
            Ring(
                progress: Double(healthKitManager.todayMetrics.activeMinutes) / exerciseGoal,
                color: .green,
                lineWidth: 12
            )
            .frame(width: 75, height: 75)
            
            // Stand Ring (placeholder)
            Ring(
                progress: 0.5, // TODO: Fetch actual stand hours
                color: .blue,
                lineWidth: 12
            )
            .frame(width: 50, height: 50)
        }
    }
}

struct Ring: View {
    let progress: Double
    let color: Color
    let lineWidth: CGFloat
    
    private var clampedProgress: Double {
        min(max(progress, 0), 1)
    }
    
    var body: some View {
        ZStack {
            // Background ring
            Circle()
                .stroke(color.opacity(0.2), lineWidth: lineWidth)
            
            // Progress ring
            Circle()
                .trim(from: 0, to: clampedProgress)
                .stroke(
                    color,
                    style: StrokeStyle(
                        lineWidth: lineWidth,
                        lineCap: .round
                    )
                )
                .rotationEffect(.degrees(-90))
                .animation(.easeInOut(duration: 1), value: clampedProgress)
        }
    }
}

#Preview {
    ActivityRingsView()
        .environmentObject(HealthKitManager.shared)
}
