//
//  WorkoutSession.swift
//  FitnessApp Watch App
//
//  Extended workout session functionality
//

import Foundation
import Combine

extension WorkoutSession {
    // MARK: - Computed Properties
    
    var durationFormatted: String {
        let minutes = Int(duration) / 60
        let seconds = Int(duration) % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
    
    var distanceFormatted: String {
        let km = distance / 1000
        return String(format: "%.2f km", km)
    }
    
    var caloriesFormatted: String {
        return String(format: "%.0f cal", calories)
    }
    
    var paceFormatted: String {
        guard pace > 0 else { return "--:--" }
        let minutes = Int(pace)
        let seconds = Int((pace - Double(minutes)) * 60)
        return String(format: "%d:%02d /km", minutes, seconds)
    }
    
    var elevationFormatted: String {
        return String(format: "%.0f m", elevationGain)
    }
    
    // MARK: - Methods
    
    func updateDuration(_ newDuration: TimeInterval) {
        duration = newDuration
    }
    
    func updateHeartRate(_ heartRate: Int) {
        currentHeartRate = heartRate
        heartRateData.append(heartRate)
        
        // Update average
        if !heartRateData.isEmpty {
            averageHeartRate = heartRateData.reduce(0, +) / heartRateData.count
        }
        
        // Update max
        if heartRate > maxHeartRate {
            maxHeartRate = heartRate
        }
    }
    
    func updateCalories(_ newCalories: Double) {
        calories = newCalories
    }
    
    func updateDistance(_ newDistance: Double) {
        distance = newDistance
    }
    
    func updateElevation(_ newElevation: Double) {
        elevationGain = newElevation
    }
    
    func pause() {
        isPaused = true
    }
    
    func resume() {
        isPaused = false
    }
    
    func end() {
        endedAt = Date()
        isPaused = false
    }
    
    func setRating(_ newRating: Int) {
        rating = min(max(newRating, 0), 5)
    }
}
