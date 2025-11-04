// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "FitnessApp",
    platforms: [
        .watchOS(.v10)
    ],
    products: [
        .library(
            name: "FitnessApp",
            targets: ["FitnessApp"]
        ),
    ],
    dependencies: [
        // No external dependencies required
        // All functionality uses native Apple frameworks
    ],
    targets: [
        .target(
            name: "FitnessApp",
            dependencies: []
        ),
        .testTarget(
            name: "FitnessAppTests",
            dependencies: ["FitnessApp"]
        ),
    ]
)
