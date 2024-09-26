# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
