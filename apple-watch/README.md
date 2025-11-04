# Scorpion26.00 Apple Watch App

Native watchOS fitness tracking app with real-time metrics, HealthKit integration, and iPhone synchronization.

## Features

- ✅ **20+ Workout Types** - Running, cycling, HIIT, strength training, yoga, and more
- ✅ **Real-Time Metrics** - Heart rate, calories, distance, pace, elevation
- ✅ **Heart Rate Zones** - 5-zone tracking with visual indicators
- ✅ **HealthKit Integration** - Read and write workout data
- ✅ **iPhone Sync** - WatchConnectivity for seamless data transfer
- ✅ **Offline Support** - Queue workouts when offline, sync when connected
- ✅ **Complications** - Activity rings, streak, stats on watch face
- ✅ **Background Tracking** - Continue tracking with screen off
- ✅ **Battery Optimized** - <15% drain per hour during workouts

## Requirements

- **macOS** Ventura 13.0+ with Xcode 15+
- **watchOS** 10.0+
- **Apple Watch** Series 4 or later
- **iPhone** with iOS 17+ (paired)
- **Apple Developer Account** ($99/year)

## Project Structure

```
apple-watch/
├── FitnessApp.swift              # App entry point
├── ContentView.swift             # Root navigation
│
├── Models/
│   ├── Workout.swift             # Workout data models
│   └── WorkoutSession.swift      # Active session model
│
├── Managers/
│   ├── WorkoutManager.swift      # Workout lifecycle
│   ├── HealthKitManager.swift    # HealthKit interface
│   ├── ConnectivityManager.swift # iPhone sync
│   └── APIManager.swift          # Backend API
│
├── Views/
│   ├── Home/
│   │   ├── HomeView.swift
│   │   ├── ActivityRingsView.swift
│   │   └── QuickStartView.swift
│   ├── Workout/
│   │   ├── WorkoutListView.swift
│   │   ├── WorkoutSessionView.swift
│   │   ├── PauseView.swift
│   │   └── SummaryView.swift
│   └── Settings/
│       └── SettingsView.swift
│
├── Utilities/
│   ├── HapticManager.swift
│   ├── Constants.swift
│   └── Extensions.swift
│
└── Complications/
    └── ComplicationController.swift
```

## Setup Instructions

### 1. Create Xcode Project

1. Open Xcode
2. File > New > Project
3. Select **watchOS** > **App**
4. Product Name: `FitnessApp`
5. Interface: **SwiftUI**
6. Life Cycle: **SwiftUI App**

### 2. Add Capabilities

In Xcode project settings, enable:

- ✅ **HealthKit**
- ✅ **Background Modes**
  - Workout processing
  - Background delivery
  - Extended runtime session
- ✅ **WatchConnectivity**

### 3. Configure Info.plist

Add the following keys:

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

### 4. Copy Source Files

Copy all files from this directory into your Xcode project:

```bash
# From this directory
cp -r Models/ /path/to/FitnessApp/
cp -r Managers/ /path/to/FitnessApp/
cp -r Views/ /path/to/FitnessApp/
cp -r Utilities/ /path/to/FitnessApp/
cp -r Complications/ /path/to/FitnessApp/
cp FitnessApp.swift /path/to/FitnessApp/
cp ContentView.swift /path/to/FitnessApp/
```

### 5. Update API Configuration

In `Managers/APIManager.swift`, update the base URL:

```swift
private let baseURL = "https://api.scorpion26.com" // Your actual API URL
```

### 6. Build and Run

1. Connect Apple Watch to Mac (or use Simulator)
2. Select watch target in Xcode
3. Click Run (⌘R)
4. Grant HealthKit permissions when prompted

## Testing

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for comprehensive testing guide.

### Quick Test

1. Launch app on watch
2. Grant HealthKit permissions
3. Tap "Running" in Quick Start
4. Verify heart rate displays
5. Run for 2-3 minutes
6. Tap pause, then end
7. Verify summary shows correct stats
8. Check iPhone Health app for workout

## API Integration

### Required Endpoints

#### 1. Upload Workout
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
  "heart_rate_data": [120, 135, 142, ...],
  "elevation_gain": 50,
  "pace_per_km": 360,
  "rating": 4
}
```

#### 2. Get Workout Library
```http
GET /api/workouts?platform=watch
Authorization: Bearer {token}
```

#### 3. Get User Stats
```http
GET /api/progress/stats
Authorization: Bearer {token}
```

## Complications

### Supported Families

- **Circular** - Activity rings progress
- **Rectangular** - Streak and next workout
- **Corner** - Current streak number
- **Graphic Circular** - Heart rate + calories
- **Graphic Rectangular** - Today's summary

### Setup

1. Long press watch face
2. Tap "Edit"
3. Swipe to complications
4. Tap complication slot
5. Select "FitnessApp"
6. Choose complication type

## Troubleshooting

### HealthKit Authorization Fails
- Check Info.plist has usage descriptions
- Verify HealthKit capability enabled
- Try resetting Health permissions in iPhone Settings

### Workout Won't Start
- Ensure HealthKit authorized
- Check watch battery > 10%
- Verify location services enabled (GPS workouts)

### iPhone Sync Not Working
- Check watch and iPhone paired
- Verify WatchConnectivity capability enabled
- Ensure iPhone app installed and running

### High Battery Drain
- Reduce GPS accuracy in settings
- Disable always-on display during workouts
- Check for background app refresh

## App Store Submission

### Checklist

- [ ] All features tested (see TESTING_CHECKLIST.md)
- [ ] Screenshots captured (all watch sizes)
- [ ] App preview video recorded (30 seconds)
- [ ] Privacy policy published
- [ ] App description written
- [ ] Keywords optimized
- [ ] Support URL active
- [ ] TestFlight beta complete

### Screenshots Required

- 40mm: 394 x 324 pixels
- 41mm: 410 x 336 pixels
- 44mm: 448 x 368 pixels
- 45mm: 484 x 396 pixels
- 49mm: 502 x 410 pixels

### Timeline

- **TestFlight Review**: 1-2 days
- **App Store Review**: 1-2 weeks
- **Total**: 2-3 weeks from submission

## Performance Targets

- **Battery**: <15% drain per hour during workouts
- **Heart Rate Accuracy**: ±5 BPM vs chest strap
- **Distance Accuracy**: ±2% vs known route
- **App Launch**: <2 seconds cold start
- **Memory Usage**: <100 MB during workout

## Known Issues

- Swimming workouts require Apple Watch Series 2+ (waterproof)
- GPS accuracy reduced in urban canyons
- Heart rate may be inaccurate during HIIT (rapid changes)
- Complications update max every 15 minutes (Apple limit)

## Support

- **Documentation**: [docs/APPLE_WATCH_APP_GUIDE.md](../docs/APPLE_WATCH_APP_GUIDE.md)
- **Testing**: [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
- **Issues**: Create GitHub issue with `apple-watch` label

## License

Copyright © 2025 Scorpion26.00. All rights reserved.

## Version History

### 1.0.0 (Current)
- Initial release
- 20+ workout types
- HealthKit integration
- iPhone sync
- Complications
- Background tracking
