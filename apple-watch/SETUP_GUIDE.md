# Apple Watch App - Complete Setup Guide

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **macOS Ventura 13.0+** installed
- [ ] **Xcode 15+** installed from Mac App Store
- [ ] **Apple Developer Account** (Individual or Organization - $99/year)
- [ ] **Physical Apple Watch** (Series 4 or later) for testing
- [ ] **iPhone** with iOS 17+ paired with the watch
- [ ] **Backend API** deployed and accessible

## Step-by-Step Setup

### 1. Create Xcode Project (15 minutes)

#### 1.1 Launch Xcode
```bash
# Open Xcode from Applications or Spotlight
open -a Xcode
```

#### 1.2 Create New Project
1. Click **File > New > Project** (⌘⇧N)
2. Select **watchOS** tab at the top
3. Select **App** template
4. Click **Next**

#### 1.3 Configure Project
- **Product Name**: `FitnessApp`
- **Team**: Select your Apple Developer team
- **Organization Identifier**: `com.scorpion26` (or your domain)
- **Bundle Identifier**: Will auto-generate as `com.scorpion26.FitnessApp`
- **Interface**: **SwiftUI**
- **Life Cycle**: **SwiftUI App**
- **Language**: **Swift**
- **Include Tests**: ✅ (checked)

Click **Next**, choose save location, click **Create**

### 2. Add Source Files (10 minutes)

#### 2.1 Create Folder Structure
In Xcode's Project Navigator (left sidebar):
1. Right-click on `FitnessApp Watch App` folder
2. Select **New Group**
3. Create these groups:
   - Models
   - Managers
   - Views
   - Utilities
   - Complications

#### 2.2 Copy Files
From terminal, navigate to the apple-watch directory and copy files:

```bash
cd /Users/julianclarkson/Documents/Scorpion26.00/apple-watch

# Copy to your Xcode project location
# Replace /path/to/FitnessApp with your actual project path

# Main files
cp FitnessApp.swift /path/to/FitnessApp/FitnessApp\ Watch\ App/
cp ContentView.swift /path/to/FitnessApp/FitnessApp\ Watch\ App/

# Models
cp Models/*.swift /path/to/FitnessApp/FitnessApp\ Watch\ App/Models/

# Managers
cp Managers/*.swift /path/to/FitnessApp/FitnessApp\ Watch\ App/Managers/

# Views
cp -r Views/* /path/to/FitnessApp/FitnessApp\ Watch\ App/Views/

# Utilities
cp Utilities/*.swift /path/to/FitnessApp/FitnessApp\ Watch\ App/Utilities/

# Complications
cp Complications/*.swift /path/to/FitnessApp/FitnessApp\ Watch\ App/Complications/
```

#### 2.3 Add Files to Xcode
1. In Xcode, right-click on each group folder
2. Select **Add Files to "FitnessApp"...**
3. Navigate to the copied files
4. Select all files in that folder
5. Ensure **Copy items if needed** is checked
6. Click **Add**

Repeat for each folder (Models, Managers, Views, Utilities, Complications)

### 3. Configure Capabilities (5 minutes)

#### 3.1 Select Target
1. Click on project name in Project Navigator (top)
2. Select **FitnessApp Watch App** target
3. Click **Signing & Capabilities** tab

#### 3.2 Add HealthKit
1. Click **+ Capability** button
2. Search for "HealthKit"
3. Double-click **HealthKit** to add

#### 3.3 Add Background Modes
1. Click **+ Capability** button
2. Search for "Background Modes"
3. Double-click **Background Modes** to add
4. Check these boxes:
   - ✅ **Workout processing**
   - ✅ **Extended runtime session**
   - ✅ **Location updates** (for GPS workouts)

#### 3.4 Add WatchConnectivity
WatchConnectivity is automatically available, no capability needed.

### 4. Configure Info.plist (10 minutes)

#### 4.1 Open Info.plist
1. In Project Navigator, expand **FitnessApp Watch App**
2. Click on **Info.plist**

#### 4.2 Add Required Keys
Click the **+** button next to "Information Property List" and add:

**HealthKit Permissions:**
```
Key: Privacy - Health Share Usage Description
Type: String
Value: We need access to read your health data including heart rate, calories, distance, and steps to accurately track your workouts and provide personalized fitness insights.

Key: Privacy - Health Update Usage Description
Type: String
Value: We need access to save your workout data to the Health app so you can view your complete fitness history and share it with other health apps.
```

**Location Permission (for GPS):**
```
Key: Privacy - Location When In Use Usage Description
Type: String
Value: We need your location to track distance, pace, and route for outdoor workouts like running and cycling.
```

**Motion Permission:**
```
Key: Privacy - Motion Usage Description
Type: String
Value: We use motion data to detect workout activity and improve tracking accuracy.
```

**Background Modes:**
```
Key: UIBackgroundModes
Type: Array
  Item 0: workout-processing
  Item 1: location
  Item 2: remote-notification
```

**Complication Support:**
```
Key: CLKComplicationPrincipalClass
Type: String
Value: $(PRODUCT_MODULE_NAME).ComplicationController

Key: CLKComplicationSupportedFamilies
Type: Array
  Item 0: CLKComplicationFamilyGraphicCircular
  Item 1: CLKComplicationFamilyGraphicRectangular
  Item 2: CLKComplicationFamilyGraphicCorner
```

### 5. Update API Configuration (2 minutes)

#### 5.1 Open APIManager.swift
In Project Navigator: `Managers/APIManager.swift`

#### 5.2 Update Base URL
Find this line:
```swift
private let baseURL = "https://api.scorpion26.com"
```

Replace with your actual API URL:
```swift
private let baseURL = "https://your-actual-api-url.com"
```

### 6. Configure Signing (5 minutes)

#### 6.1 Automatic Signing
1. Select **FitnessApp Watch App** target
2. Go to **Signing & Capabilities** tab
3. Check **Automatically manage signing**
4. Select your **Team** from dropdown
5. Xcode will automatically create provisioning profiles

#### 6.2 Verify Bundle Identifier
Ensure Bundle Identifier is unique:
- Format: `com.yourcompany.FitnessApp`
- Must match your Apple Developer account

### 7. Build and Test (10 minutes)

#### 7.1 Connect Apple Watch
1. Ensure Apple Watch is paired with your iPhone
2. Connect iPhone to Mac via USB or WiFi
3. Enable Developer Mode on watch:
   - Watch: Settings > Privacy & Security > Developer Mode > ON
   - Restart watch when prompted

#### 7.2 Select Scheme
1. In Xcode toolbar, click scheme dropdown (next to Run button)
2. Select **FitnessApp Watch App**
3. Select your **Apple Watch** as destination

#### 7.3 Build Project
1. Click **Product > Build** (⌘B)
2. Wait for build to complete
3. Fix any compilation errors if they appear

#### 7.4 Run on Device
1. Click **Run** button (▶) or press ⌘R
2. Wait for app to install on watch (may take 2-3 minutes first time)
3. App will launch automatically on watch

### 8. Grant Permissions (5 minutes)

#### 8.1 HealthKit Authorization
When app launches, you'll see:
1. **HealthKit Permission** prompt
2. Tap **Allow** for all requested permissions:
   - Heart Rate
   - Active Energy
   - Distance
   - Steps
   - Workouts

#### 8.2 Location Permission
If prompted:
1. Tap **Allow While Using App**

### 9. Test Basic Functionality (15 minutes)

#### 9.1 Home Screen
- [ ] Activity rings display
- [ ] Today's stats show (may be 0 initially)
- [ ] Quick start buttons visible

#### 9.2 Start Workout
1. Tap **Running** in Quick Start
2. Verify workout session starts
3. Check metrics display:
   - [ ] Duration counting
   - [ ] Heart rate showing (may take 10-15 seconds)
   - [ ] Calories updating

#### 9.3 Swipe Between Metrics
- [ ] Swipe left/right to see different metric pages
- [ ] All 4 pages accessible

#### 9.4 Pause/Resume
1. Tap **Pause** button
2. Verify duration stops
3. Tap **Resume**
4. Verify duration continues

#### 9.5 End Workout
1. Tap **Stop** button
2. Tap **End Workout** in menu
3. Verify summary screen appears
4. Check all stats displayed correctly

#### 9.6 Verify Health App
1. Open **Health** app on iPhone
2. Navigate to **Browse > Activity > Workouts**
3. Verify your test workout appears
4. Check heart rate data saved

### 10. Configure Complications (Optional - 10 minutes)

#### 10.1 Add to Watch Face
1. On Apple Watch, long-press current watch face
2. Tap **Edit**
3. Swipe to **Complications** screen
4. Tap a complication slot
5. Scroll to find **FitnessApp**
6. Select desired complication type
7. Tap **Digital Crown** to save

#### 10.2 Verify Complication
- [ ] Complication displays on watch face
- [ ] Data shows correctly
- [ ] Tapping opens app

## Troubleshooting

### Build Errors

**"Cannot find type 'HKHealthStore'"**
- Solution: Ensure HealthKit capability is enabled
- Verify: Target > Signing & Capabilities > HealthKit present

**"Module 'WatchKit' not found"**
- Solution: Clean build folder (⌘⇧K) and rebuild
- Verify: watchOS deployment target is 10.0+

**"Signing certificate not found"**
- Solution: Xcode > Preferences > Accounts > Download Manual Profiles
- Or: Enable "Automatically manage signing"

### Runtime Errors

**HealthKit authorization doesn't appear**
- Check Info.plist has usage descriptions
- Verify HealthKit capability enabled
- Try: Delete app from watch and reinstall

**Heart rate shows 0**
- Wait 10-15 seconds for sensor to activate
- Ensure watch is worn snugly
- Check: Settings > Privacy > Health > FitnessApp has permissions

**App crashes on launch**
- Check Xcode console for error messages
- Verify all files added to target
- Try: Clean build folder and rebuild

**GPS not working**
- Ensure Location permission granted
- Check: iPhone Settings > Privacy > Location Services > FitnessApp
- Verify: Background Modes includes "Location updates"

### Connection Issues

**iPhone not reachable**
- Ensure iPhone and Watch on same WiFi
- Or: Ensure Bluetooth enabled on both devices
- Check: Watch app shows "Connected" in Settings

**Workout doesn't sync**
- Check internet connection
- Verify API URL is correct in APIManager.swift
- Check Xcode console for network errors

## Next Steps

### 1. Complete Testing
Follow the comprehensive [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md):
- [ ] Test all 20+ workout types
- [ ] Test on multiple watch models
- [ ] Verify accuracy (heart rate, distance, calories)
- [ ] Test edge cases (interruptions, low battery)
- [ ] Performance testing (battery, memory, CPU)

### 2. Prepare for TestFlight

#### 2.1 Archive Build
1. Select **Any watchOS Device** as destination
2. Click **Product > Archive**
3. Wait for archive to complete
4. Organizer window opens automatically

#### 2.2 Upload to App Store Connect
1. In Organizer, select your archive
2. Click **Distribute App**
3. Select **App Store Connect**
4. Click **Upload**
5. Wait for processing (10-30 minutes)

#### 2.3 Configure TestFlight
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Go to **TestFlight** tab
4. Add internal testers
5. Add external testers (optional)
6. Submit for beta review (1-2 days)

### 3. Prepare App Store Submission

#### 3.1 Capture Screenshots
Required sizes:
- 40mm: 394 x 324 pixels
- 41mm: 410 x 336 pixels
- 44mm: 448 x 368 pixels
- 45mm: 484 x 396 pixels
- 49mm: 502 x 410 pixels

Capture:
- Home screen with activity rings
- Workout session in progress
- Summary screen
- Settings screen
- Complication on watch face

#### 3.2 Record App Preview Video
- 30 seconds max
- Show: Starting workout, metrics updating, completion
- Format: H.264, 30fps
- Resolution: Match watch size

#### 3.3 Write App Description
```
Scorpion26 - Your Ultimate Fitness Companion

Transform your Apple Watch into a powerful fitness tracker with real-time metrics, heart rate zones, and seamless Health app integration.

FEATURES:
• 20+ Workout Types - Running, cycling, HIIT, strength, yoga, and more
• Real-Time Metrics - Heart rate, calories, distance, pace, elevation
• Heart Rate Zones - 5-zone tracking with visual indicators
• HealthKit Integration - Automatic sync with Apple Health
• Offline Support - Track workouts anywhere, sync later
• Watch Face Complications - See your stats at a glance
• Battery Optimized - All-day tracking without draining battery

PERFECT FOR:
• Runners tracking pace and distance
• Cyclists monitoring performance
• HIIT enthusiasts tracking intensity
• Strength trainers logging workouts
• Anyone serious about fitness

REQUIREMENTS:
• Apple Watch Series 4 or later
• watchOS 10.0 or later
• Paired iPhone with iOS 17+

Start your fitness journey today!
```

#### 3.4 Submit for Review
1. Complete all App Store Connect fields
2. Upload screenshots and video
3. Set pricing (Free or Paid)
4. Select availability regions
5. Click **Submit for Review**
6. Wait 1-2 weeks for review

## Support Resources

- **Documentation**: [APPLE_WATCH_APP_GUIDE.md](../docs/APPLE_WATCH_APP_GUIDE.md)
- **Testing**: [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
- **Apple Developer**: https://developer.apple.com/watchos
- **HealthKit Docs**: https://developer.apple.com/documentation/healthkit
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/

## Estimated Timeline

- **Setup & Configuration**: 1 hour
- **Initial Testing**: 2 hours
- **Full Testing**: 1 week
- **TestFlight Beta**: 1 week
- **App Store Review**: 1-2 weeks
- **Total**: 3-4 weeks to launch

## Checklist

- [ ] Xcode project created
- [ ] All source files added
- [ ] Capabilities configured
- [ ] Info.plist updated
- [ ] API URL configured
- [ ] Signing configured
- [ ] Builds successfully
- [ ] Runs on physical watch
- [ ] HealthKit permissions granted
- [ ] Basic workout tested
- [ ] Data appears in Health app
- [ ] Complications working
- [ ] Ready for full testing

---

**Questions?** Check the troubleshooting section or create an issue in the repository.
