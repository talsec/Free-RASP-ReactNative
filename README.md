![FreeRasp](https://raw.githubusercontent.com/talsec/Free-RASP-Community/master/visuals/freeRASPforRN.png)

![GitHub Repo stars](https://img.shields.io/github/stars/talsec/Free-RASP-Community?color=green) ![GitHub](https://img.shields.io/github/license/talsec/Free-RASP-Community) ![GitHub](https://img.shields.io/github/last-commit/talsec/Free-RASP-Community) ![Publisher](https://img.shields.io/pub/publisher/freerasp) [![42matters](https://42matters.com/badges/sdk-installations/talsec)](https://42matters.com/sdks/android/talsec)

[<img src="https://assets.42matters.com/badges/2024/04/rising-star.svg?m=04" width="100"/>](https://42matters.com/sdks/android/talsec)

# freeRASP for React Native

freeRASP for React Native is a mobile in-app protection and security monitoring plugin. It aims to cover the main aspects of RASP (Runtime App Self Protection) and application shielding.

# :notebook_with_decorative_cover: Table of contents

- [Overview](#overview)
- [Usage](#usage)
  - [(Optional) Create a new React Native demo application](#optional-create-a-new-react-native-demo-application)
  - [Step 1: Install the plugin](#step-1-install-the-plugin)
  - [Step 2: Set up the dependencies](#step-2-set-up-the-dependencies)
  - [Step 3: Import freeRASP into the app](#step-3-import-freerasp-into-the-app)
  - [Step 4: Setup the configuration, callbacks and initialize freeRASP](#step-4-setup-the-configuration-callbacks-and-initialize-freerasp)
    - [Configuration](#configuration)
      - [Dev vs Release version](#dev-vs-release-version)
    - [Callbacks](#callbacks)
    - [Initialization](#initialization)
    - [Alternative: Initialize freeRASP in a Class component](#alternative-initialize-freerasp-in-a-class-component)
  - [Step 5: Additional note about obfuscation](#step-5-additional-note-about-obfuscation)
  - [Step 6: User Data Policies](#step-6-user-data-policies)
- [Using Expo SDK](#using-expo-sdk)
- [Troubleshooting](#troubleshooting)
- [Security Report](#security-report)
- [Talsec Commercial Subscriptions](#money_with_wings-talsec-commercial-subscriptions)
  - [Plans Comparison](#plans-comparison)
- [About Us](#about-us)
- [License](#license)

# Overview

The freeRASP is available for Flutter, Cordova, React Native, Android, and iOS developers. We encourage community contributions, investigations of attack cases, joint data research, and other activities aiming to make better app security and app safety for end-users.

freeRASP plugin is designed to combat

- Reverse engineering attempts
- Re-publishing or tampering with the apps
- Running application in a compromised OS environment
- Malware, fraudsters, and cybercriminal activities

Key features are the detection and prevention of

- Root/Jailbreak (e.g., unc0ver, check1rain)
- Hooking framework (e.g., Frida, Shadow)
- Untrusted installation method
- App/Device (un)binding

Additional freeRASP features include low latency, easy integration and a weekly [Security Report](#security-report) containing detailed information about detected incidents and potential threats, summarizing the state of your app security.

The commercial version provides a top-notch protection level, extra features, support and maintenance. One of the most valued commercial features is AppiCrypt® - App Integrity Cryptogram.

It allows easy to implement API protection and App Integrity verification on the backend to prevent API abuse:

- Bruteforce attacks
- Botnets
- Session-hijacking
- DDoS

It is a unified solution that works across all mobile platforms without dependency on external web services (i.e., without extra latency, an additional point of failure, and maintenance costs).

Learn more about commercial features at [https://talsec.app](https://talsec.app).

Learn more about freemium freeRASP features at [GitHub main repository](https://github.com/talsec/Free-RASP-Community).

# Usage

We will guide you step-by-step, but you can always check the expected result in the example folder.

## (Optional) Create a new React Native demo application

Create a new React Native project:

    $ npx react-native init AwesomeProject

## Step 1: Install the plugin

    $ npm install freerasp-react-native

or

    $ yarn add freerasp-react-native

## Step 2: Set up the dependencies

### Android

freeRASP for Android requires a minimum **SDK** level of **23**. React Native projects, by default, support even lower levels of minimum SDK. This creates an inconsistency we must solve by updating the minimum SDK level of the application:

1. From the root of your project, go to **android > build.gradle**.
1. In **buildscript**, update **minSdkVersion** to at least **23** (Android 6.0) or higher.

```groovy
buildscript {
    ext {
      minSdkVersion 23
      ...
    }
}
```

### iOS

freeRASP React Native plugin uses Pods. Navigate to the `ios` folder and run:

    $ pod install

**IMPORTANT:** If you are upgrading from version 1.x.x, please remove the old TalsecRuntime.xcframework and integration script from your project:

1. Open up the **.xcworkspace** file
1. Go to **Target -> Build Phases -> Link Binary With Libraries**
1. Remove **TalsecRuntime.xcframework**
1. On top bar select **Product -> Scheme -> Edit Scheme...**
1. On the left side select **Build -> Pre-actions**
1. Find integration script and click trash icon on the right side to remove it
1. Update freeRASP. If you are getting any errors, check that in `node_modules/freerasp-react-native/ios`, TalsecRuntime.xcframework is a folder, not a symlink. If it is a symlink, remove it and reinstall the module.
1. run `pod install`

## Step 3: Import freeRASP into the app

We provide a React Custom Hook that handles all required logic as registration of freeRASP, mounting and unmounting of listeners for you. Import the Hook into your app:

```ts
import { useFreeRasp } from 'freerasp-react-native';
```

## Step 4: Setup the configuration, callbacks and initialize freeRASP

First, the configuration and callbacks will be explained. Then the [Initialization](#initialization) chapter shows the implementation.

### Configuration

You need to provide configuration for freeRASP to work properly and initialize it. The freeRASP configuration is an JavaScript object that contains configs for both Android and iOS, as well as common configuration. You must fill all the required values for the plugin to work. Use the following template to provide configuration to the Talsec plugin. You can find detailed description of the configuration below.

```ts
// app configuration
const config = {
  androidConfig: {
    packageName: 'com.awesomeproject',
    certificateHashes: ['your_signing_certificate_hash_base64'],
    supportedAlternativeStores: ['com.sec.android.app.samsungapps'],
  },
  iosConfig: {
    appBundleId: 'com.awesomeproject',
    appTeamId: 'your_team_ID',
  },
  watcherMail: 'your_email_address@example.com',
  isProd: true,
};
```

#### The configuration object should consist of:

1. `androidConfig` _: object | undefined_ - required for Android devices, has following keys:

   - `packageName` _: string_ - package name of your app you chose when you created it
   - `certificateHashes` _: string[]_ - hash of the certificate of the key which was used to sign the application. **Hash which is passed here must be encoded in Base64 form.** If you are not sure how to get your certificate hash, you can check out the guide on our [Github wiki](https://github.com/talsec/Free-RASP-Community/wiki/Getting-your-signing-certificate-hash-of-app). Multiple hashes are supported, e.g. if you are using a different one for the Huawei App Gallery.
   - `supportedAlternativeStores` _: string[] | undefined_ - Google Play Store and Huawei AppGallery are supported out of the box, you **don't have to assign anything**. You can add other stores like the Samsung Galaxy Store in the example code (`com.sec.android.app.samsungapps`). For more information, visit the [Detecting Unofficial Installation](https://github.com/talsec/Free-RASP-Community/wiki/Threat-detection#detecting-unofficial-installation) wiki page.

1. `iosConfig` _: object | undefined_ - required for iOS devices, has following keys:
   - `appBundleId` _: string_ - Bundle ID of your app
   - `appTeamId` _: string_ - the Apple Team ID
1. `watcherMail` _: string_ - your mail address where you wish to receive reports. Mail has a strict form `name@domain.com` which is passed as String.
1. `isProd` _: boolean | undefined_ - defaults to `true` when undefined. If you want to use the Dev version to disable checks described [in the chapter below](#dev-vs-release-version), set the parameter to `false`. Make sure that you have the Release version in the production (i.e. isProd set to true)!

If you are developing only for one of the platforms, you can skip the configuration part for the other one, i.e., delete the unused configuration.

#### Dev vs Release version

The Dev version is used to not complicate the development process of the application, e.g. if you would implement killing of the application on the debugger callback. It disables some checks which won't be triggered during the development process:

- Emulator-usage (simulator)
- Debugging (debug)
- Signing (appIntegrity)
- Unofficial store (unofficialStore)

### Callbacks

freeRASP executes periodical checks when the application is running. Handle the detected threats in the **listeners**. For example, you can log the event, show a window to the user or kill the application. [Visit our wiki](https://github.com/talsec/Free-RASP-Community/wiki/Threat-detection) to learn more details about the performed checks and their importance for app security.

### Initialization

You should initialize the freeRASP in the entry point to your app, which is usually in `App.jsx` or `App.tsx`. Just copy & paste this code inside your root component / function, then setup the configuration and reactions to listeners:

```ts
// reactions for detected threats
const actions = {
  // Android & iOS
  privilegedAccess: () => {
    console.log('privilegedAccess');
  },
  // Android & iOS
  debug: () => {
    console.log('debug');
  },
  // Android & iOS
  simulator: () => {
    console.log('simulator');
  },
  // Android & iOS
  appIntegrity: () => {
    console.log('appIntegrity');
  },
  // Android & iOS
  unofficialStore: () => {
    console.log('unofficialStore');
  },
  // Android & iOS
  hooks: () => {
    console.log('hooks');
  },
  // Android & iOS
  deviceBinding: () => {
    console.log('deviceBinding');
  },
  // Android & iOS
  secureHardwareNotAvailable: () => {
    console.log('secureHardwareNotAvailable');
  },
  // Android & iOS
  passcode: () => {
    console.log('passcode');
  },
  // iOS only
  deviceID: () => {
    console.log('deviceID');
  },
  // Android only
  obfuscationIssues: () => {
    console.log('obfuscationIssues');
  },
};

useFreeRasp(config, actions);
```

_Please note that useFreeRasp Hook should be called outside useEffect._

When freeRASP initializes correctly, you should see `freeRASP initialized` message in logs. Otherwise, you'll see warning with description of what went wrong.

_You can override this default behavior by extending the `actions` object with `started` key (to change action after successful initialization), and `initializationError` key (to set up action after unsuccessful initialization)_

### Alternative: Initialize freeRASP in a Class component

- import methods from the freeRASP plugin:

  ```ts
  import {
    talsecStart,
    setThreatListeners,
    removeThreatListeners,
  } from 'freerasp-react-native';
  ```

- override `constructor()` method in the entry point to your app, set listeners to threats and start freeRASP:

  ```ts
  constructor(props) {
    super(props);

    // Add these method calls
    setThreatListeners(actions);
    talsecStart(config);
  }
  ```

  _In this code snippet, `actions` is object with your reactions to threats and `config` is freeRASP configuration object from previous parts of the readme._

- override `componentWillUnmount()` method where you clean up the listeners:

  ```ts
  componentWillUnmount() {
    removeThreatListeners();
  }
  ```

## Step 5: Additional note about obfuscation

The freeRASP contains public API, so the integration process is as simple as possible. Unfortunately, this public API also creates opportunities for the attacker to use publicly available information to interrupt freeRASP operations or modify your custom reaction implementation in threat callbacks. In order to provide as much protection as possible, freeRASP obfuscates its source code. However, if all other code is not obfuscated, one can easily deduct that the obfuscated code belongs to a security library. We, therefore, encourage you to apply code obfuscation to your app, making the public API more difficult to find and also partially randomized for each application so it cannot be automatically abused by generic hooking scripts.

Probably the easiest way to obfuscate your app is via code minification, a technique that reduces the size of the compiled code by removing unnecessary characters, whitespace, and renaming variables and functions to shorter names. It can be configured for Android devices in **android/app/build.gradle** like so:

```groovy
android {
    buildTypes {
        release {
            ...
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

Please note that some other modules in your app may rely on reflection, therefore it may be necessary to add corresponding keep rules into proguard-rules.pro file.

If there is a problem with the obfuscation, freeRASP will notify you about it via `obfuscationIssues` callback.

You can read more about Android obfuscation in the official documentation:

- https://developer.android.com/studio/build/shrink-code
- https://www.guardsquare.com/manual/configuration/usage

## Step 6: User Data Policies

See the generic info about freeRASP data collection [here](https://github.com/talsec/Free-RASP-Community/tree/master#data-collection-processing-and-gdpr-compliance).

Google Play [requires](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) all app publishers to declare how they collect and handle user data for the apps they publish on Google Play. They should inform users properly of the data collected by the apps and how the data is shared and processed. Therefore, Google will reject the apps which do not comply with the policy.

Apple has a [similar approach](https://developer.apple.com/app-store/app-privacy-details/) and specifies the types of collected data.

You should also visit our [Android](https://github.com/talsec/Free-RASP-Android) and [iOS](https://github.com/talsec/Free-RASP-iOS) submodules to learn more about their respective data policies.

And you're done 🎉!

If you encounter any other issues, you can see the list of solved issues [here](https://github.com/talsec/Free-RASP-ReactNative/issues?q=is%3Aissue+is%3Aclosed), or open up a [new one](https://github.com/talsec/Free-RASP-ReactNative/issues?q=is%3Aissue+is%3Aopen).

# Using Expo SDK
freeRASP for React Native is bare React Native plugin. When installing freeRASP into a project that uses Expo SDK, there may be extra configuration needed. We provide plugin config that sets the dependencies automatically. It is recommended to use the plugin config. However, manual setup is also possible.

## Plugin config setup
Add the plugin config into your `app.json` and specify the `minSdkVersion` (use at least 23).
Additionally, if you are using Expo 50, increase version of R8 above 8.2 with the `R8Version` property [(to support sealed classes on Android)](https://github.com/talsec/Free-RASP-ReactNative/issues/60).
```json
"plugins": [
      [
        "freerasp-react-native/app.plugin.js",
        {
          "android": {
            "minSdkVersion": "23",
            "R8Version": "8.3.37" // optional for Expo 50
          }
        }
      ]
    ],
```


## Manual setup
### 1. Increase minSdkVersion

This can be done in two ways:
-  update the `minSdkVersion` property directly in __android/build.gradle__, or
- use `expo-build-properties` plugin, which updates the property in the prebuild phase. [Read more in the Expo docs](https://docs.expo.dev/versions/latest/sdk/build-properties/).

### 2. Add maven dependency
- open __android/build.gradle__ _(if you don't see the android folder, run `npx expo prebuild -p android` in terminal to create it)_
- add following dependency under __allprojects > repositories__:
`maven { url "https://europe-west3-maven.pkg.dev/talsec-artifact-repository/freerasp" }`
- if not already configured, add also
`maven { url 'https://www.jitpack.io' }`

# Troubleshooting

### Could not determine the dependencies of task `':freerasp-react-native:compileDebugAidl'`

**Solution:**

- In `package.json`, update `react-native` to a higher patch version and run `npm install` (or `yarn install`).
- [See this issue to find out which patch version is relevant for you.](https://github.com/facebook/react-native/issues/35210)

### `Invalid hook call. Hooks can only be called inside of the body of a function component.`

**Reason:**
The `useFreeRasp` Hook cannot be called inside useEffect.

**Solution:**

- If you want to initialize freeRASP inside useEffect, you have to handle the initialization on your own. Such inititialization would look like this:

```ts
import {
  setThreatListeners,
  talsecStart,
  removeThreatListeners,
} from 'freerasp-react-native';

...

useEffect(() => {
  setThreatListeners(actions);
  talsecStart(config);

  return () => {
    removeThreatListeners();
  };
}, []);
```

Where `actions`, `config` are objects described in previous chapters.

### Unsupported Swift architecture

**Reason:**
The arm64 macro is not set under Rosetta.

**Solution:**
Go to `<your_project>/node_modules/freerasp-react-native/ios/TalsecRuntime.xcframework/ios-arm64/TalsecRuntime.framework/Headers/TalsecRuntime-Swift.h` and move following code (lines 4 and 5 in the file) to the top of the file:

```
#ifndef TALSECRUNTIME_SWIFT_H
#define TALSECRUNTIME_SWIFT_H
```

### Execution failed for task ':freerasp-react-native:minifyReleaseWithR8'.
`Sealed classes are not supported as program classes when generating class files.`

**Reason:**
Kotlin sealed classes are not supported in AGP 8.1 used by some versions of RN (currently 0.73.x)

**Solution:**
Follow [this comment on Google Issue Tracker](https://issuetracker.google.com/issues/227160052#comment37), which contains also additional information about the issue.

# Security Report

The Security Report is a weekly summary describing the application's security state and characteristics of the devices it runs on in a practical and easy-to-understand way.

The report provides a quick overview of the security incidents, their dynamics, app integrity, and reverse engineering attempts. It contains info about the security of devices, such as OS version or the ratio of devices with screen locks and biometrics. Each visualization also comes with a concise explanation.

To receive Security Reports, fill out the _watcherMail_ field in [config](#configuration).

![dashboard](https://raw.githubusercontent.com/talsec/Free-RASP-Community/master/visuals/dashboard.png)

# :money_with_wings: Talsec Commercial Subscriptions

Talsec offers commercial plans on top of freeRASP (Business RASP+):

- No limits of Fair Usage Policy (100K App Downloads)
- No Data Collection from your app
- FinTech grade security, features and SLA (see more in [this post](https://github.com/orgs/talsec/discussions/5))
- Protect APIs and risk scoring by AppiCrypt®

Learn more at [talsec.app](https://talsec.app).

Not to overlook, the one of the most valued commercial features is [AppiCrypt®](https://www.talsec.app/appicrypt) - App Integrity Cryptogram.

It allows easy-to-implement API protection and App Integrity verification on the backend to prevent API abuse:

- Bruteforce attacks
- Botnets
- API abuse by App impersonation
- Session-hijacking
- DDoS

It is a unified solution that works across all mobile platforms without dependency on external web services (i.e., without extra latency, an additional point of failure, and maintenance costs).

Learn more about commercial features at [talsec.app](https://talsec.app).

**TIP:** You can try freeRASP and then upgrade easily to an enterprise service.

## Plans Comparison

<i>
freeRASP is freemium software i.e. there is a Fair Usage Policy (FUP) that impose some limitations on the free usage. See the FUP section in the table below
</i>
<br/>
<br/>
<table>
    <thead>
        <tr>
            <th></th>
            <th>freeRASP</th>
            <th>Business RASP+</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan=5><strong>Runtime App Self Protection (RASP, app shielding)</strong></td>
        </tr>
        <tr>
            <td>Advanced root/jailbreak protections (including Magisk)</td>
            <td>basic</td>
            <td>advanced</td>
        </tr>
        <tr>
            <td>Runtime reverse engineering controls 
                <ul>
                    <li>Debugger</li>
                    <li>Emulator / Simulator</li>
                    <li>Hooking and reversing frameworks (e.g. Frida, Magisk, XPosed, Cydia Substrate and more)</li>
                </ul>
            </td>
            <td>basic</td>
            <td>advanced</td>
        </tr>
        <tr>
            <td>Runtime integrity controls 
                <ul>
                    <li>Tampering protection</li>
                    <li>Repackaging / Cloning protection</li>
                    <li>Device binding protection</li>
                    <li>Unofficial store detection</li>
                </ul>
            </td>
            <td>basic</td>
            <td>advanced</td>
        </tr>
        <tr>
            <td>Device OS security status check 
                <ul>
                    <li>HW security module control</li>
                    <li>Screen lock control</li>
                    <li>Google Play Services enabled/disabled</li>
                    <li>Last security patch update</li>
                </ul>
            </td>
            <td>yes</td>
            <td>yes</td>
        </tr>
        <tr>
            <td>UI protection 
                <ul>
                    <li>Overlay protection</li>
                    <li>Accessibility services misuse protection</li>
                </ul>
            </td>
            <td>no</td>
            <td>yes</td>
        </tr>
        <tr>
            <td colspan=5><strong>Hardening suite</strong></td>
        </tr>
        <tr>
            <td>Security hardening suite 
                <ul>                
                    <li>End-to-end encryption</li>
                    <li>Strings protection (e.g. API keys)</li>
                    <li>Dynamic TLS certificate pinning</li>
                </ul>
            </td>
            <td>no</td>
            <td>yes</td>
        </tr>
        <tr>
            <td colspan=5><strong>AppiCrypt® - App Integrity Cryptogram</strong></td>
        </tr>
        <tr>
            <td>API protection by mobile client integrity check, online risk scoring, online fraud prevention, client App integrity check. The cryptographic proof of app & device integrity.</td>
            <td>no</td>
            <td>yes</td>
        </tr>
        <tr>
            <td colspan=5><strong>Security events data collection, Auditing and Monitoring tools</strong></td>
        </tr>
        <tr>
            <td>Threat events data collection from SDK</td>
            <td>yes</td>
            <td>configurable</td>
        </tr>
        <tr>
            <td>AppSec regular email reporting service</td>
            <td>yes (up to 100k devices)</td>
            <td>yes</td>
        </tr>
        <tr>
            <td>UI portal for Logging, Data analytics and auditing</td>
            <td>no</td>
            <td>yes</td>
        </tr>
        <tr>     
          <td colspan=5><strong>Support and Maintenance</strong></td>
        </tr>
        <tr>
            <td>SLA</td>
            <td>Not committed</td>
            <td>yes</td>
        </tr>
        <tr>
            <td>Maintenance updates</td>
            <td>Not committed</td>
            <td>yes</td>
        </tr>
        <tr>
            <td colspan=5><strong>Fair usage policy</strong></td>
        </tr>
        <tr>
            <td>Mentioning of the App name and logo in the marketing communications of Talsec (e.g. "Trusted by" section on the web).</td>
            <td>over 100k downloads</td>
            <td>no</td>
        </tr>
        <tr>
            <td>Threat signals data collection to Talsec database for processing and product improvement</td>
            <td>yes</td>
            <td>no</td>
        </tr>
    </tbody>
</table>

For further comparison details (and planned features), follow our [discussion](https://github.com/talsec/Free-RASP-Community/discussions/5).

# About Us

Talsec is an academic-based and community-driven mobile security company. We deliver in-App Protection and a User Safety suite for Fintechs. We aim to bridge the gaps between the user's perception of app safety and the strong security requirements of the financial industry.

Talsec offers a wide range of security solutions, such as App and API protection SDK, Penetration testing, monitoring services, and the User Safety suite. You can check out offered products at [our web](https://www.talsec.app).

# License

This project is provided as freemium software i.e. there is a fair usage policy that impose some limitations on the free usage. The SDK software consists of opensource and binary part which is property of Talsec. The opensource part is licensed under the MIT License - see the [LICENSE](https://github.com/talsec/Free-RASP-Community/blob/master/LICENSE) file for details.
