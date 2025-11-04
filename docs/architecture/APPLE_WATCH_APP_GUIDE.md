# Apple Watch App Implementation Guide

## Overview
Native watchOS app for Scorpion26.00 fitness platform with real-time workout tracking, heart rate monitoring, and seamless iPhone synchronization.

## Tech Stack
- **SwiftUI** - watchOS 10+ UI framework
- **HealthKit** - Health data integration
- **WatchConnectivity** - iPhone sync
- **Combine** - Reactive programming
- **CoreData** - Local persistence

## Project Structure

```
FitnessApp/
├── FitnessApp Watch App/
│   ├── FitnessApp.swift                 # App entry point
│   ├── ContentView.swift                # Root view
│   │
│   ├── Views/
│   │   ├── Home/
│   │   │   ├── HomeView.swift           # Main dashboard
│   │   │   ├── ActivityRingsView.swift  # Apple Health rings
│   │   │   └── QuickStartView.swift     # Quick workout buttons
│   │   │
│   │   ├── Workout/
│   │   │   ├── WorkoutListView.swift    # Available workouts
│   │   │   ├── WorkoutSessionView.swift # Active workout
│   │   │   ├── MetricsView.swift        # Swipeable metrics
│   │   │   ├── PauseView.swift          # Pause overlay
│   │   │   └── SummaryView.swift        # Workout complete
│   │   │
│   │   └── Settings/
│   │       └── SettingsView.swift       # App settings
│   │
│   ├── Models/
│   │   ├── Workout.swift                # Workout data model
│   │   ├── WorkoutSession.swift         # Active session model
│   │   ├── HealthMetrics.swift          # Health data model
│   │   └── UserStats.swift              # User statistics
│   │
│   ├── Managers/
│   │   ├── WorkoutManager.swift         # Workout logic
│   │   ├── HealthKitManager.swift       # HealthKit interface
│   │   ├── ConnectivityManager.swift    # iPhone sync
│   │   └── APIManager.swift             # Backend API
│   │
│   ├── Utilities/
│   │   ├── Extensions.swift             # Swift extensions
│   │   ├── Constants.swift              # App constants
│   │   └── HapticManager.swift          # Haptic feedback
│   │
│   ├── Complications/
│   │   ├── ComplicationController.swift # Complication logic
│   │   └── ComplicationViews.swift      # Complication UI
│   │
│   └── Resources/
│       ├── Assets.xcassets              # Images/colors
│       └── Info.plist                   # App configuration
│
└── FitnessApp.xcodeproj
```

## Setup Instructions

### 1. Prerequisites
- macOS Ventura 13.0+ with Xcode 15+
- Apple Developer Account ($99/year)
- Physical Apple Watch (Series 4+) for testing
- Paired iPhone with iOS 17+

### 2. Create Xcode Project
```bash
# Open Xcode
# File > New > Project
# Select "watchOS" > "App"
# Product Name: FitnessApp
# Interface: SwiftUI
# Life Cycle: SwiftUI App
# Include Notification Scene: No
```

### 3. Configure Capabilities
In Xcode project settings:
- ✅ HealthKit
- ✅ Background Modes
  - Workout processing
  - Background delivery
  - Extended runtime session
- ✅ WatchConnectivity

### 4. Info.plist Configuration
```xml
<key>NSHealthShareUsageDescription</key>
<string>We need access to read your health data to track workouts</string>
<key>NSHealthUpdateUsageDescription</key>
<string>We need access to save your workout data to Health</string>
<key>WKBackgroundModes</key>
<array>
    <string>workout-processing</string>
    <string>extended-runtime</string>
</array>
```

## Core Features Implementation

### 1. Workout Types
```swift
enum WorkoutType: String, CaseIterable {
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
}
```

### 2. Real-Time Metrics
- **Duration**: MM:SS format, updates every second
- **Heart Rate**: BPM with zone indicator (5 zones)
- **Calories**: Active energy burned
- **Distance**: GPS-based (outdoor workouts)
- **Pace**: Min/km or min/mile
- **Elevation**: Gain/loss (GPS workouts)

### 3. Heart Rate Zones
```swift
enum HeartRateZone: Int {
    case warmup = 1    // 50-60% max HR
    case fatBurn = 2   // 60-70% max HR
    case cardio = 3    // 70-80% max HR
    case peak = 4      // 80-90% max HR
    case maximum = 5   // 90-100% max HR
    
    func color() -> Color {
        switch self {
        case .warmup: return .gray
        case .fatBurn: return .blue
        case .cardio: return .green
        case .peak: return .orange
        case .maximum: return .red
        }
    }
}
```

## API Integration

### Endpoints

#### 1. Sync Workout
```http
POST /api/workouts/sessions
Content-Type: application/json
Authorization: Bearer {token}

{
  "started_at": "2025-11-04T10:00:00Z",
  "ended_at": "2025-11-04T10:30:00Z",
  "duration_minutes": 30,
  "workout_type": "running",
  "calories": 450,
  "distance_meters": 5000,
  "average_heart_rate": 145,
  "max_heart_rate": 168,
  "heart_rate_data": [120, 135, 142, 150, ...],
  "elevation_gain": 50,
  "pace_per_km": 360,
  "rating": 4
}
```

#### 2. Get Workout Library
```http
GET /api/workouts?platform=watch
Authorization: Bearer {token}

Response:
{
  "workouts": [
    {
      "id": "uuid",
      "name": "Morning Run",
      "type": "running",
      "duration_minutes": 30,
      "difficulty": "moderate"
    }
  ]
}
```

#### 3. Get User Stats
```http
GET /api/progress/stats
Authorization: Bearer {token}

Response:
{
  "current_streak": 7,
  "total_workouts": 45,
  "total_calories": 15000,
  "total_distance": 120000,
  "achievements": [...]
}
```

## HealthKit Integration

### Required Permissions

**Read:**
- Heart Rate (`HKQuantityTypeIdentifier.heartRate`)
- Active Energy Burned (`HKQuantityTypeIdentifier.activeEnergyBurned`)
- Distance Walking/Running (`HKQuantityTypeIdentifier.distanceWalkingRunning`)
- Distance Cycling (`HKQuantityTypeIdentifier.distanceCycling`)
- Steps (`HKQuantityTypeIdentifier.stepCount`)
- Workouts (`HKObjectType.workoutType()`)

**Write:**
- Workouts (`HKObjectType.workoutType()`)
- Active Energy Burned
- Heart Rate Samples
- Distance

### Authorization Flow
```swift
func requestAuthorization() async throws {
    let healthStore = HKHealthStore()
    
    let typesToRead: Set<HKObjectType> = [
        HKObjectType.quantityType(forIdentifier: .heartRate)!,
        HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
        HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
        HKObjectType.quantityType(forIdentifier: .distanceCycling)!,
        HKObjectType.workoutType()
    ]
    
    let typesToWrite: Set<HKSampleType> = [
        HKObjectType.workoutType(),
        HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
        HKObjectType.quantityType(forIdentifier: .heartRate)!
    ]
    
    try await healthStore.requestAuthorization(toShare: typesToWrite, read: typesToRead)
}
```

## WatchConnectivity

### Data Transfer Types

1. **User Info Transfer** - Guaranteed delivery, queued
   - Completed workouts
   - User settings
   - Achievement unlocks

2. **Application Context** - Latest state only
   - Current streak
   - Today's stats
   - Active goals

3. **Messages** - Real-time, requires reachability
   - Start workout notification
   - Live stats updates

### Implementation
```swift
func sendWorkoutToiPhone(_ workout: WorkoutSession) {
    guard WCSession.default.isReachable else {
        // Queue for later
        queueWorkout(workout)
        return
    }
    
    let workoutData: [String: Any] = [
        "type": "workout_completed",
        "data": workout.toDictionary()
    ]
    
    WCSession.default.transferUserInfo(workoutData)
}
```

## Complications

### Supported Families
- **Circular** - Activity rings progress
- **Rectangular** - Next scheduled workout
- **Corner** - Current streak number
- **Graphic Circular** - Heart rate + calories
- **Graphic Rectangular** - Today's summary

### Update Schedule
- Every 15 minutes (Apple limit)
- On workout completion
- On goal achievement
- On streak milestone

## Battery Optimization

### Strategies
1. **Reduce GPS accuracy** when battery < 20%
2. **Throttle heart rate sampling** from 1s to 5s intervals
3. **Pause background sync** when battery < 10%
4. **Disable always-on display** option for long workouts
5. **Cache API responses** to reduce network calls

### Target Battery Usage
- **30-minute workout**: < 7% battery drain
- **60-minute workout**: < 15% battery drain
- **Background sync**: < 1% per hour

## Offline Support

### Local Storage (CoreData)
- Last 7 days of workouts
- Workout library (cached)
- User stats snapshot
- Queued API calls

### Sync Strategy
```swift
// Queue offline workouts
func queueWorkout(_ workout: WorkoutSession) {
    let context = persistentContainer.viewContext
    let entity = QueuedWorkout(context: context)
    entity.data = workout.toJSON()
    entity.timestamp = Date()
    try? context.save()
}

// Sync when online
func syncQueuedWorkouts() async {
    let queued = fetchQueuedWorkouts()
    for workout in queued {
        do {
            try await apiManager.uploadWorkout(workout)
            deleteQueuedWorkout(workout)
        } catch {
            // Retry later
        }
    }
}
```

## Testing Checklist

### Device Testing
- [ ] Apple Watch Series 6
- [ ] Apple Watch Series 8
- [ ] Apple Watch Series 9
- [ ] Apple Watch Ultra

### Workout Testing
- [ ] 30-minute outdoor run (GPS)
- [ ] 60-minute strength training (no GPS)
- [ ] 45-minute indoor cycling
- [ ] 20-minute HIIT workout
- [ ] Pause/resume functionality
- [ ] Background tracking (screen off)

### Accuracy Testing
- [ ] Heart rate accuracy (±5 BPM vs chest strap)
- [ ] Calorie calculation (compare to Apple Fitness)
- [ ] Distance accuracy (±2% vs known route)
- [ ] GPS tracking quality

### Edge Cases
- [ ] Airplane mode (offline)
- [ ] Low battery (< 10%)
- [ ] iPhone disconnected
- [ ] App force quit during workout
- [ ] Watch restart during workout
- [ ] Multiple workouts same day

### Performance Testing
- [ ] Battery drain measurement
- [ ] Memory usage monitoring
- [ ] CPU usage during workout
- [ ] Network bandwidth usage

### Complication Testing
- [ ] All complication families render
- [ ] Updates occur correctly
- [ ] Tap actions work
- [ ] Data accuracy

## App Store Submission

### Requirements
1. **Screenshots** - All watch sizes (40mm, 41mm, 44mm, 45mm, 49mm)
2. **App Preview Video** - 30-second demo
3. **Privacy Policy** - URL required
4. **App Description** - Marketing copy
5. **Keywords** - SEO optimization
6. **Support URL** - Help documentation

### Review Checklist
- [ ] HealthKit usage clearly explained
- [ ] Background modes justified
- [ ] Privacy policy published
- [ ] All features functional
- [ ] No crashes or bugs
- [ ] Follows Apple Watch HIG

### Timeline
- **TestFlight Beta**: 1-2 days review
- **App Store Review**: 1-2 weeks
- **Total**: 2-3 weeks from submission

## Development Timeline

### Week 1-2: Foundation
- Xcode project setup
- HealthKit integration
- Basic workout tracking
- Data models

### Week 3-4: UI & Features
- SwiftUI views
- Workout session logic
- Real-time metrics
- Pause/resume

### Week 5: Integration
- iPhone sync (WatchConnectivity)
- API integration
- Offline support
- Background modes

### Week 6: Polish & Launch
- Complications
- Testing (all devices)
- Bug fixes
- App Store submission

## Resources

### Documentation
- [Apple Watch Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/watchos)
- [HealthKit Documentation](https://developer.apple.com/documentation/healthkit)
- [WatchConnectivity Framework](https://developer.apple.com/documentation/watchconnectivity)
- [SwiftUI for watchOS](https://developer.apple.com/tutorials/swiftui)

### Sample Code
- [Apple Workout Sample](https://developer.apple.com/documentation/healthkit/workouts_and_activity_rings)
- [SpeedySloth Sample](https://developer.apple.com/documentation/healthkit/workouts_and_activity_rings/building_a_workout_app_for_apple_watch)

## Next Steps
1. Set up Xcode project with watchOS target
2. Implement HealthKit authorization
3. Build workout tracking UI
4. Create workout session manager
5. Integrate with backend API
6. Test on physical device
7. Submit to TestFlight
