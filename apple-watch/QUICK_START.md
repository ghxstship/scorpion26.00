# Apple Watch App - Quick Start

## 5-Minute Setup

### 1. Create Xcode Project
```bash
# Open Xcode
# File > New > Project > watchOS > App
# Name: FitnessApp
# Interface: SwiftUI
```

### 2. Copy Files
```bash
cd /Users/julianclarkson/Documents/Scorpion26.00/apple-watch

# Copy all files to your Xcode project
# Drag folders into Xcode: Models, Managers, Views, Utilities, Complications
```

### 3. Enable Capabilities
In Xcode Target Settings:
- ✅ HealthKit
- ✅ Background Modes (workout-processing, extended-runtime)

### 4. Update Info.plist
Add these keys:
- Privacy - Health Share Usage Description
- Privacy - Health Update Usage Description
- Privacy - Location When In Use Usage Description

### 5. Configure API
In `Managers/APIManager.swift`:
```swift
private let baseURL = "YOUR_API_URL_HERE"
```

### 6. Build & Run
- Connect Apple Watch
- Select watch as target
- Click Run (⌘R)
- Grant HealthKit permissions

### 7. Test
- Start a workout
- Verify heart rate displays
- Complete workout
- Check Health app

## Done! 🎉

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.
See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for comprehensive testing.
