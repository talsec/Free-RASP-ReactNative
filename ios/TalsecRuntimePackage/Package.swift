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
      url: "https://storage.googleapis.com/talsec-artifact-repository/freerasp/ios/react-native/7.1.0/TalsecRuntime.xcframework.zip",
      checksum: "35e62f290aca44e62519794334a1933011b1611dbb21ff2b7f083c97a88df006"
    ),
  ]
)
