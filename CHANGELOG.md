# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.14.1] - 2024-03-10

- iOS SDK version:  6.8.0
- Android SDK version: 14.0.1

### React Native

#### Fixed

- Take Android targetSdkVersion, compileSdkVersion from plugin only

## [3.14.0] - 2024-03-05

- iOS SDK version:  6.8.0
- Android SDK version: 14.0.1

### React Native

#### Added

- `blockScreenCapture` method to block/unblock screen capture
- `isScreenCaptureBlocked` method to get the current screen capture blocking status
- New callbacks:
    - `screenshot`: Detects when a screenshot is taken
    - `screenRecording`: Detects when screen recording is active

#### Changed

- Raised Android compileSDK level to 35

#### Fixed 

- Compatibility issues with RN New Architecture
- Added proguard rules for malware data serialization in release mode on Android

### Android

#### Added

- Passive and active screenshot/screen recording protection

#### Changed

- Improved root detection

#### Fixed

- Proguard rules to address warnings from okhttp dependency

### iOS

#### Added

- Passive Screenshot/Screen Recording detection

## [3.13.0] - 2024-12-20

- iOS SDK version:  6.6.3
- Android SDK version: 13.2.0

### Android

#### Added

- Added request integrity information to data collection headers.
- Enhanced and accelerated the data collection logic.

## [3.12.0] - 2024-12-06

- iOS SDK version:  6.6.3
- Android SDK version: 13.0.0

### React Native

#### Changed

- App icons for detected malware are not fetched automatically anymore, which reduces computation required to retrieve malware data. From now on, app icons have to be retrieved using the `getAppIcon` method
- Parsing of malware data is now async

### Android

#### Changed

- Malware data is now parsed on background thread to improve responsiveness

## [3.11.0] - 2024-11-19

### React Native

#### Added

- Added `adbEnabled` callback, which allows you to detect USB debugging option enabled in the developer settings on the device

### Android

#### Added

- ADB detection feature

## [3.10.0] - 2024-11-15

-   Android SDK version: 12.0.0
-   iOS SDK version: 6.6.3

### React Native

#### Added

-  Added configuration fields for malware detection 

### Android

#### Added

- New feature: **malware detection** as a new callback for enhanced app security

#### Fixed

- Refactoring Magisk checks in the root detection

### iOS

#### Added

- Enhanced security with **[Serotonin Jailbreak](https://github.com/SerotoninApp/Serotonin) Detection** to identify compromised devices.

#### Changed

- Updated SDK code signing; it will now be signed with:
  - Team ID: PBDDS45LQS
  - Team Name: Lynx SFT s.r.o.

## [3.9.3] - 2024-10-28
- Android SDK version: 11.1.3
- iOS SDK version: 6.6.1

### iOS

#### Changed
- Renewed the signing certificate

## [3.9.2] - 2024-10-18
- Android SDK version: 11.1.3
- iOS SDK version: 6.6.0

-   Android SDK version: 11.1.3
-   iOS SDK version: 6.6.0

### Android

#### Fixed
- Reported ANR issues present on some devices were resolved ([GH Flutter issue #138](https://github.com/talsec/Free-RASP-Flutter/issues/138))
- Reported crashes caused by ConcurrentModificationException and NullPointerException were resolved ([GH Flutter issue #140](https://github.com/talsec/Free-RASP-Flutter/issues/140))
- Reported crashes caused by the UnsupportedOperationException were resolved

## [3.9.1] - 2024-09-30
- Android SDK version: 11.1.1
- iOS SDK version: 6.6.0

### Android

#### Fixed
- False positives for hook detection

## [3.9.0] - 2024-09-25

- Android SDK version: 11.1.0
- iOS SDK version: 6.6.0

### React Native

#### Fixed

- Fixed incorrect path to types in package.json

#### Changed

- Improved error messages when validation of the freeRASP configuration fails

### Android

#### Added

- Added the auditing of the internal execution for the future check optimization and overall security improvements.

#### Fixed

- Fixed native crashes (SEGFAULT errors) in `ifpip` method
- Fixed collision for command line tools (like ping) invoked without absolute path

#### Changed

- ❗️Breaking: Changed the way TalsecConfig is created, we introduced a Builder pattern to make the process more streamlined and readable
- Updated OpenSSL to version 3.0.14
- Updated CURL to version 8.8.0
- Refactored fetching the list of installed applications for root and hook detection.

### iOS

#### Added

- [Dopamine](https://github.com/opa334/Dopamine) jailbreak detection.

#### Changed

- Updated OpenSSL to version 3.0.14
- Updated CURL to version 8.8.0

## [3.8.2] - 2024-09-02

### React Native

#### Fixed
- Updated proguard rules to resolve build issues in RN 0.75.x

## [3.8.1] - 2024-06-19

### React Native

#### Changed
- CHANGELOG now adheres to the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

## [3.8.0] - 2024-05-31

# freeRASP 3.8.0

- ⚡ Added new threat `systemVPN` for VPN detection
- 📄 Documentation updates

### Android

- ⚡ Added new threat `devMode` for Developer mode detection
- ⚡ Fixed proguard warning in specific versions of RN
- ⚡ Fixed issue with Arabic alphabet in logs caused by the device’s default system locale
- ✔️ Increased the version of the GMS dependency
- ✔️ Updated CA bundle

### iOS
- ⚡ Enhanced and accelerated the data collection logic
- ⚡ Fixed issue with Arabic alphabet in logs caused by the device’s default system locale
- ⚡ Passcode check is now periodical
- ✔️ Updated CA bundle

# freeRASP 3.7.2

- ⚡ Update expo config plugin to fix release build issue in RN 0.73

# freeRASP 3.7.1

### Android

- ⚡ Updated freeRASP SDK artifact hosting ensuring better stability and availibility
- ⚡ Fixed compatibility issues with RN < 0.63

# freeRASP 3.7.0

- ⚡ Added support for apps built with Expo SDK
- 📄 Documentation updates

### Android

- ⚡ Shortened duration of threat evaluation
- ⚡ Fixed a native crash bug during one of the native root checks (detected after NDK upgrade)
- ⚡ Improved _appIntegrity_ check and its logging
- ⚡ Updated `CURL` to `8.5.0` and `OpenSSL` to `1.1.1w`

### iOS

- ❗ Added Privacy Manifest
- ❗ Added codesigning for the SDK, it is signed by:
  - _Team ID_: `ASQC376HCN`
  - _Team Name_: `AHEAD iTec, s.r.o.`
- ⚡ Improved obfuscation of Swift and C strings
- ⚡ Fixed memory leak ([freeRASP iOS issue #13](https://github.com/talsec/Free-RASP-iOS/issues/13))
- ⚡ Updated `CURL` to `8.5.0` and `OpenSSL` to `1.1.1w`

# freeRASP 3.6.1

- 📄 Documentation updates

### iOS

- ⚡ Fixed bug that caused app being killed in specific situations ([#42](https://github.com/talsec/Free-RASP-ReactNative/issues/42))

# freeRASP 3.6.0

- ⚡ Improved reaction obfuscation
- 📄 Documentation updates

### Android

- ⚡ Fixed ProviderException which could be occassionally triggered
- ⚡ Fixed bug causing incompatibility with some versions of React Native ([#38](https://github.com/talsec/Free-RASP-ReactNative/issues/38))

### iOS

- ❗ Raised supported Xcode version to 14.3.1
- ⚡ Improved SDK obfuscation

# freeRASP 3.5.0

- ⚠️ Updated the `talsecStart()` method to return `Promise<string>`. If freeRASP starts successfuly, the method will return `freeRASP started` string. There are not any changes of the interface if you are using the provided `useFreeRasp` hook.
- ⚡ Improved the message passing between native iOS/Android and React Native sides
- ✔️ Restricted message passing to valid callbacks only. If an invalid callback is received, the SDK will kill the app

# freeRASP 3.4.0

- 📄 Documentation updates and improvements

### Android

- ✔️ updated CA bundle for logging pinning
- ✔️ added error logging of network issues within the logging process
- ✔️ added retry politics for logging
- ⚡ fixed issue with DeadObjectException on Android 5 and 6 caused by excessive PackageManager.queryIntentActivities() usage
- ⚡ improved root detection capabilities

# freeRASP 3.3.1

### iOS

- ⚡ Fixed issue with duplicate headers that caused `Multiple commands produce ...` error ([#11](https://github.com/talsec/Free-RASP-ReactNative/issues/11), [#26](https://github.com/talsec/Free-RASP-ReactNative/issues/26))

# freeRASP 3.3.0

### Android

- ✔️ Removed PolarSSL native library
- ✔️ Fixed issue with denied USE_BIOMETRICS permission

# freeRASP 3.2.0

### Android

- ✔️ Added support for AGP 8.0

# freeRASP 3.1.0

### Android

- ⚡ Fixed issue with incorrect Keystore type detection on Android 11 and above (https://github.com/talsec/Free-RASP-Flutter/issues/77)

### iOS

- ⚡ Reduced timeout period for logging from 20 sec to 5 sec
- ⚡ Logging is now async in all calls

# freeRASP 3.0.0

### Android

- ❗ BREAKING CHANGE: Raised minimum supported Android version to 6.0 (API level 23)
- ✔️ Removed deprecated BouncyCastle dependency that could cause [errors in the build phase](https://github.com/talsec/Free-RASP-ReactNative/issues/13)
- ✔️ Fixed issue that could cause NullPointerException
- 🆕 Added new `obfuscationIssues` check, which is triggered when freeRASP doesn't detect any obfuscation of the source code

### iOS

- ⚠️ `passcodeChange` check has been deprecated
- 🛠️ Refactored the code base

# freeRASP 2.0.3

### iOS

- ✔️ Fixed issue with metadata in iOS framework
- 📄 Documentation updates and improvements

# freeRASP 2.0.2

- 📄 Documentation updates and improvements

# freeRASP 2.0.1

- 📄 Documentation updates and improvements

# freeRASP 2.0.0

## What's new?

Most of the changes relates to accomodating a new way of choosing between the dev and release version of the SDK. There are also some breaking changes in the API, such as renaming parameters and changing types of callbacks. Android has also removed the HMS dependencies and improved the root detection capabilities.

### JS/TS interface

- ❗ BREAKING API CHANGE: Renamed **'device binding'** to **deviceBinding**
  - ❗ This allows us to remove apostrophes from other callbacks, too. E.g. **'privilegedAccess'** to **privilegedAccess**
- ❗ Added **isProd** boolean parameter, which now differentiates between the release (true) and dev (false) version of the SDK. By default set to **true**
- ❗ **androidConfig** and **iosConfig** are from now on optionals, you can omit a platform if you are not developing for it

### Android

- ❗ Removed the HMS dependencies
- ❗ Only one version of the SDK is used from now on, instead of two separate for dev and release
- ❗ The app's build.gradle does not have to be modified now
- ⚡ Improved root detection accuracy by moving the 'ro.debuggable' property state to an ignored group
- ⚡ Enhanced root detection capabilities by moving the selinux properties check to device state
- ⚡ Fine-tuning root evaluation strategy

### iOS

- ❗ Removed one of the xcframeworks
- ❗ Removed the dependency on the symlinks choosing the proper version (release/dev)
- ❗️ Removed pre-built script for changing the Debug and Release versions

### Other improvements

- 📄 Documentation updates and improvements
- ⚡ Updated demo app for new implementation

# freeRASP 1.1.0

We are proud to share with you the first batch of improvements of freeRASP!

## What's new?

Android devices now support device state listeners. What's more, we unified remaining Android and iOS interfaces for more convenient developer's experience.

### Android

- 🆕 Android now has support for device state callbacks:
  - 📲 **`Secure Hardware Not Available`**: fires when hardware-backed KeyStore is not available
  - 📲 **`Passcode`**: fires when freeRASP detects that device is not secured with any type of lock

### iOS

- ❗ BREAKING API CHANGE: Renamed `Missing Secure Enclave` to **`Secure Hardware Not Available`** to match the newly added Android callback. The functionality remains unchanged.

### Other improvements

- 📄 Documentation updates and improvements

# freeRASP 1.0.0

- Initial release of freeRASP.
