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
      url: "https://storage.googleapis.com/talsec-artifact-repository/freerasp/ios/react-native/7.1.2/TalsecRuntime.xcframework.zip",
      checksum: "eb93f36c235572f47cfebc8e6af79a9eb002f5756eb73ee9d0b874d0c90fa4aa"
    ),
  ]
)
