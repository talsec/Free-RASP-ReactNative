// swift-tools-version:5.9
import PackageDescription

let package = Package(
  name: "TalsecRuntime",
  platforms: [
    .iOS(.v13),
  ],
  products: [
    .library(name: "TalsecRuntime", targets: ["TalsecRuntime"]),
  ],
  targets: [
    .binaryTarget(
      name: "TalsecRuntime",
      url: "https://storage.googleapis.com/talsec-artifact-repository/freerasp/ios/react-native/8.0.1/TalsecRuntime.xcframework.zip",
      checksum: "97cb3423b296339aad3fd5ef9e24efd8a7ed0e437dd735f99a309ea1695071eb"
    ),
  ]
)
