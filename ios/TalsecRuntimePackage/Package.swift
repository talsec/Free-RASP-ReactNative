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
      url: "https://storage.googleapis.com/freerasp/ios/react-native/6.14.4/TalsecRuntime.zip",
      checksum: "1ee2ba204688b4f059f9ab30b8f8c769f673f3412c7e46d52a2dc25b3561105b"
    ),
  ]
)
