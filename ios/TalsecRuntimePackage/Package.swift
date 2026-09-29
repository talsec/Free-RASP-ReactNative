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
      url: "https://storage.googleapis.com/talsec-artifact-repository/freerasp/ios/react-native/7.1.4/TalsecRuntime.xcframework.zip",
      checksum: "7953acc175adeb138e12c179eebe9ca25c7846a57aa8d07b98f0018e1849db92"
    ),
  ]
)
