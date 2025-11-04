//
//  ComplicationController.swift
//  FitnessApp Watch App
//
//  Manages watch face complications
//

import ClockKit
import SwiftUI

class ComplicationController: NSObject, CLKComplicationDataSource {
    
    // MARK: - Timeline Configuration
    
    func getComplicationDescriptors(handler: @escaping ([CLKComplicationDescriptor]) -> Void) {
        let descriptors = [
            CLKComplicationDescriptor(
                identifier: "activity_rings",
                displayName: "Activity Rings",
                supportedFamilies: [.graphicCircular, .graphicCorner]
            ),
            CLKComplicationDescriptor(
                identifier: "current_streak",
                displayName: "Current Streak",
                supportedFamilies: [.graphicRectangular, .graphicCorner]
            ),
            CLKComplicationDescriptor(
                identifier: "next_workout",
                displayName: "Next Workout",
                supportedFamilies: [.graphicRectangular]
            ),
            CLKComplicationDescriptor(
                identifier: "stats",
                displayName: "Today's Stats",
                supportedFamilies: [.graphicCircular, .graphicRectangular]
            )
        ]
        
        handler(descriptors)
    }
    
    func handleSharedComplicationDescriptors(_ complicationDescriptors: [CLKComplicationDescriptor]) {
        // Handle shared complications if needed
    }
    
    // MARK: - Timeline Population
    
    func getCurrentTimelineEntry(
        for complication: CLKComplication,
        withHandler handler: @escaping (CLKComplicationTimelineEntry?) -> Void
    ) {
        let entry = createTimelineEntry(for: complication, date: Date())
        handler(entry)
    }
    
    func getTimelineEntries(
        for complication: CLKComplication,
        after date: Date,
        limit: Int,
        withHandler handler: @escaping ([CLKComplicationTimelineEntry]?) -> Void
    ) {
        // Create entries for the next hour (4 entries, 15 minutes apart)
        var entries: [CLKComplicationTimelineEntry] = []
        
        for i in 1...min(limit, 4) {
            let entryDate = date.addingTimeInterval(TimeInterval(i * 15 * 60))
            if let entry = createTimelineEntry(for: complication, date: entryDate) {
                entries.append(entry)
            }
        }
        
        handler(entries)
    }
    
    func getTimelineEndDate(
        for complication: CLKComplication,
        withHandler handler: @escaping (Date?) -> Void
    ) {
        // Update every hour
        let endDate = Date().addingTimeInterval(3600)
        handler(endDate)
    }
    
    // MARK: - Placeholder Templates
    
    func getLocalizableSampleTemplate(
        for complication: CLKComplication,
        withHandler handler: @escaping (CLKComplicationTemplate?) -> Void
    ) {
        let template = createTemplate(for: complication, date: Date())
        handler(template)
    }
    
    // MARK: - Template Creation
    
    private func createTimelineEntry(
        for complication: CLKComplication,
        date: Date
    ) -> CLKComplicationTimelineEntry? {
        guard let template = createTemplate(for: complication, date: date) else {
            return nil
        }
        
        return CLKComplicationTimelineEntry(date: date, complicationTemplate: template)
    }
    
    private func createTemplate(
        for complication: CLKComplication,
        date: Date
    ) -> CLKComplicationTemplate? {
        switch complication.family {
        case .graphicCircular:
            return createGraphicCircularTemplate(for: complication.identifier)
            
        case .graphicRectangular:
            return createGraphicRectangularTemplate(for: complication.identifier)
            
        case .graphicCorner:
            return createGraphicCornerTemplate(for: complication.identifier)
            
        default:
            return nil
        }
    }
    
    // MARK: - Graphic Circular Templates
    
    private func createGraphicCircularTemplate(for identifier: String) -> CLKComplicationTemplate? {
        switch identifier {
        case "activity_rings":
            // Activity rings complication
            let template = CLKComplicationTemplateGraphicCircularStackImage()
            template.line1ImageProvider = CLKFullColorImageProvider(
                fullColorImage: UIImage(systemName: "figure.run")!
            )
            template.line2TextProvider = CLKSimpleTextProvider(text: "500")
            return template
            
        case "stats":
            // Heart rate + calories
            let template = CLKComplicationTemplateGraphicCircularStackText()
            template.line1TextProvider = CLKSimpleTextProvider(text: "❤️ 145")
            template.line2TextProvider = CLKSimpleTextProvider(text: "🔥 450")
            return template
            
        default:
            return nil
        }
    }
    
    // MARK: - Graphic Rectangular Templates
    
    private func createGraphicRectangularTemplate(for identifier: String) -> CLKComplicationTemplate? {
        switch identifier {
        case "current_streak":
            // Current streak display
            let template = CLKComplicationTemplateGraphicRectangularStandardBody()
            template.headerImageProvider = CLKFullColorImageProvider(
                fullColorImage: UIImage(systemName: "flame.fill")!
            )
            template.headerTextProvider = CLKSimpleTextProvider(text: "Streak")
            template.body1TextProvider = CLKSimpleTextProvider(text: "7 Days")
            template.body2TextProvider = CLKSimpleTextProvider(text: "45 total workouts")
            return template
            
        case "next_workout":
            // Next scheduled workout
            let template = CLKComplicationTemplateGraphicRectangularStandardBody()
            template.headerImageProvider = CLKFullColorImageProvider(
                fullColorImage: UIImage(systemName: "figure.run")!
            )
            template.headerTextProvider = CLKSimpleTextProvider(text: "Next Workout")
            template.body1TextProvider = CLKSimpleTextProvider(text: "Morning Run")
            template.body2TextProvider = CLKSimpleTextProvider(text: "30 min • 6:00 AM")
            return template
            
        case "stats":
            // Today's stats summary
            let template = CLKComplicationTemplateGraphicRectangularStandardBody()
            template.headerTextProvider = CLKSimpleTextProvider(text: "Today")
            template.body1TextProvider = CLKSimpleTextProvider(text: "450 cal • 5.2 km")
            template.body2TextProvider = CLKSimpleTextProvider(text: "8,234 steps")
            return template
            
        default:
            return nil
        }
    }
    
    // MARK: - Graphic Corner Templates
    
    private func createGraphicCornerTemplate(for identifier: String) -> CLKComplicationTemplate? {
        switch identifier {
        case "current_streak":
            // Streak number in corner
            let template = CLKComplicationTemplateGraphicCornerStackText()
            template.innerTextProvider = CLKSimpleTextProvider(text: "7")
            template.outerTextProvider = CLKSimpleTextProvider(text: "DAYS")
            return template
            
        case "activity_rings":
            // Activity ring progress
            let template = CLKComplicationTemplateGraphicCornerGaugeText()
            template.gaugeProvider = CLKSimpleGaugeProvider(
                style: .ring,
                gaugeColor: .red,
                fillFraction: 0.75
            )
            template.outerTextProvider = CLKSimpleTextProvider(text: "75%")
            return template
            
        default:
            return nil
        }
    }
    
    // MARK: - Privacy
    
    func getPrivacyBehavior(
        for complication: CLKComplication,
        withHandler handler: @escaping (CLKComplicationPrivacyBehavior) -> Void
    ) {
        // Show placeholder on lock screen
        handler(.showOnLockScreen)
    }
}
