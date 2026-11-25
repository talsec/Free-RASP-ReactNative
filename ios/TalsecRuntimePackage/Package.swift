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
      url: "https://storage.googleapis.com/talsec-artifact-repository/freerasp/ios/react-native/9.0.0/TalsecRuntime.xcframework.zip",
      checksum: "c75f9d083cecf7ca069465cd0e09dd0ed88aaa47d15a60936ed54be0cbe75234"
    ),
  ]
)
