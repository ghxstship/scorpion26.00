//
//  Workout.swift
//  FitnessApp Watch App
//
//  Workout data models
//

import Foundation
import HealthKit

// MARK: - Workout Type
enum WorkoutType: String, CaseIterable, Codable {
    case running = "Running"
    case cycling = "Cycling"
    case walking = "Walking"
    case hiit = "HIIT"
    case strength = "Strength Training"
    case yoga = "Yoga"
    case swimming = "Swimming"
    case rowing = "Rowing"
    case elliptical = "Elliptical"
    case stairs = "Stair Climbing"
    case indoorRun = "Indoor Running"
    case indoorCycle = "Indoor Cycling"
    
    var hkWorkoutType: HKWorkoutActivityType {
        switch self {
        case .running: return .running
        case .cycling: return .cycling
        case .walking: return .walking
        case .hiit: return .highIntensityIntervalTraining
        case .strength: return .traditionalStrengthTraining
        case .yoga: return .yoga
        case .swimming: return .swimming
        case .rowing: return .rowing
        case .elliptical: return .elliptical
        case .stairs: return .stairClimbing
        case .indoorRun: return .running
        case .indoorCycle: return .cycling
        }
    }
    
    var icon: String {
        switch self {
        case .running, .indoorRun: return "figure.run"
        case .cycling, .indoorCycle: return "figure.outdoor.cycle"
        case .walking: return "figure.walk"
        case .hiit: return "flame.fill"
        case .strength: return "dumbbell.fill"
        case .yoga: return "figure.mind.and.body"
        case .swimming: return "figure.pool.swim"
        case .rowing: return "figure.rowing"
        case .elliptical: return "figure.elliptical"
        case .stairs: return "figure.stairs"
        }
    }
    
    var usesGPS: Bool {
        switch self {
        case .running, .cycling, .walking:
            return true
        default:
            return false
        }
    }
}

// MARK: - Heart Rate Zone
enum HeartRateZone: Int, CaseIterable {
    case warmup = 1    // 50-60% max HR
    case fatBurn = 2   // 60-70% max HR
    case cardio = 3    // 70-80% max HR
    case peak = 4      // 80-90% max HR
    case maximum = 5   // 90-100% max HR
    
    var name: String {
        switch self {
        case .warmup: return "Warm Up"
        case .fatBurn: return "Fat Burn"
        case .cardio: return "Cardio"
        case .peak: return "Peak"
        case .maximum: return "Maximum"
        }
    }
    
    var color: String {
        switch self {
        case .warmup: return "gray"
        case .fatBurn: return "blue"
        case .cardio: return "green"
        case .peak: return "orange"
        case .maximum: return "red"
        }
    }
    
    func range(maxHR: Int) -> ClosedRange<Int> {
        let lower: Double
        let upper: Double
        
        switch self {
        case .warmup:
            lower = 0.50
            upper = 0.60
        case .fatBurn:
            lower = 0.60
            upper = 0.70
        case .cardio:
            lower = 0.70
            upper = 0.80
        case .peak:
            lower = 0.80
            upper = 0.90
        case .maximum:
            lower = 0.90
            upper = 1.00
        }
        
        let lowerBound = Int(Double(maxHR) * lower)
        let upperBound = Int(Double(maxHR) * upper)
        return lowerBound...upperBound
    }
    
    static func zone(for heartRate: Int, maxHR: Int) -> HeartRateZone {
        for zone in HeartRateZone.allCases.reversed() {
            if zone.range(maxHR: maxHR).contains(heartRate) {
                return zone
            }
        }
        return .warmup
    }
}

// MARK: - Workout Model
struct Workout: Identifiable, Codable {
    let id: UUID
    let name: String
    let type: WorkoutType
    let durationMinutes: Int
    let difficulty: String
    let description: String?
    
    init(id: UUID = UUID(), name: String, type: WorkoutType, durationMinutes: Int, difficulty: String, description: String? = nil) {
        self.id = id
        self.name = name
        self.type = type
        self.durationMinutes = durationMinutes
        self.difficulty = difficulty
        self.description = description
    }
}

// MARK: - Workout Session
class WorkoutSession: ObservableObject, Identifiable {
    let id: UUID
    let workoutType: WorkoutType
    let startedAt: Date
    var endedAt: Date?
    
    @Published var duration: TimeInterval = 0
    @Published var calories: Double = 0
    @Published var distance: Double = 0 // meters
    @Published var currentHeartRate: Int = 0
    @Published var averageHeartRate: Int = 0
    @Published var maxHeartRate: Int = 0
    @Published var heartRateData: [Int] = []
    @Published var elevationGain: Double = 0 // meters
    @Published var isPaused: Bool = false
    @Published var rating: Int = 0
    
    var pace: TimeInterval {
        guard distance > 0 else { return 0 }
        return (duration / 60) / (distance / 1000) // min/km
    }
    
    var currentZone: HeartRateZone {
        let maxHR = 220 - 30 // Simplified, should use user's actual age
        return HeartRateZone.zone(for: currentHeartRate, maxHR: maxHR)
    }
    
    init(workoutType: WorkoutType) {
        self.id = UUID()
        self.workoutType = workoutType
        self.startedAt = Date()
    }
    
    func toDictionary() -> [String: Any] {
        return [
            "id": id.uuidString,
            "workout_type": workoutType.rawValue,
            "started_at": ISO8601DateFormatter().string(from: startedAt),
            "ended_at": endedAt.map { ISO8601DateFormatter().string(from: $0) } as Any,
            "duration_minutes": Int(duration / 60),
            "calories": calories,
            "distance_meters": distance,
            "average_heart_rate": averageHeartRate,
            "max_heart_rate": maxHeartRate,
            "heart_rate_data": heartRateData,
            "elevation_gain": elevationGain,
            "pace_per_km": pace,
            "rating": rating
        ]
    }
}

// MARK: - Health Metrics
struct HealthMetrics {
    var heartRate: Int = 0
    var calories: Double = 0
    var distance: Double = 0
    var steps: Int = 0
    var activeMinutes: Int = 0
}

// MARK: - User Stats
struct UserStats: Codable {
    let currentStreak: Int
    let totalWorkouts: Int
    let totalCalories: Double
    let totalDistance: Double
    let achievements: [Achievement]
    
    struct Achievement: Codable, Identifiable {
        let id: UUID
        let name: String
        let icon: String
        let unlockedAt: Date
    }
}
