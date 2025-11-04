//
//  HapticManager.swift
//  FitnessApp Watch App
//
//  Manages haptic feedback
//

import Foundation
import WatchKit

class HapticManager {
    static let shared = HapticManager()
    
    private init() {}
    
    func playStart() {
        WKInterfaceDevice.current().play(.start)
    }
    
    func playStop() {
        WKInterfaceDevice.current().play(.stop)
    }
    
    func playPause() {
        WKInterfaceDevice.current().play(.click)
    }
    
    func playResume() {
        WKInterfaceDevice.current().play(.start)
    }
    
    func playEnd() {
        WKInterfaceDevice.current().play(.success)
    }
    
    func playSuccess() {
        WKInterfaceDevice.current().play(.success)
    }
    
    func playError() {
        WKInterfaceDevice.current().play(.failure)
    }
    
    func playNotification() {
        WKInterfaceDevice.current().play(.notification)
    }
    
    func playMilestone() {
        // Play a sequence for milestone achievements
        WKInterfaceDevice.current().play(.success)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            WKInterfaceDevice.current().play(.success)
        }
    }
}
