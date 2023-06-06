![FreeRasp](https://raw.githubusercontent.com/talsec/Free-RASP-Community/master/visuals/freeRASPforRN.png)

![GitHub Repo stars](https://img.shields.io/github/stars/talsec/Free-RASP-Community?color=green) ![GitHub](https://img.shields.io/github/license/talsec/Free-RASP-Community) ![GitHub](https://img.shields.io/github/last-commit/talsec/Free-RASP-Community) ![Publisher](https://img.shields.io/pub/publisher/freerasp)

# freeRASP for React Native

freeRASP for React Native is a mobile in-app protection and security monitoring plugin. It aims to cover the main aspects of RASP (Runtime App Self Protection) and application shielding.

# :notebook_with_decorative_cover: Table of contents

- [Overview](#overview)
- [Requirements](#requirements)
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
- [Troubleshooting](#troubleshooting)
- [Security Report](#security-report)
- [Commercial versions (RASP+ and more)](#bar_chart-commercial-versions-rasp-and-more)
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

# Requirements

Following minimal version requirements have to be met
in order to run freeRASP in your app:

- `react-native` >= `0.65.3`

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

_All dependencies of freeRASP for Android are resolved automatically._

### iOS

freeRASP React Native plugin uses Pods. Navigate to the `ios` folder and run:

    $ pod install

**IMPORTANT:** If you are upgrading from a previous version of freeRASP, please remove the old TalsecRuntime.xcframework and integration script from your project:

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
    // supportedAlternativeStores: ['storeOne', 'storeTwo'],
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
   - `supportedAlternativeStores` _: string[] | undefined_ - If you publish on the Google Play Store and/or Huawei AppGallery, you **don't have to assign anything** there as those are supported out of the box.

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
  // iOS only
  passcodeChange: () => {
    console.log('passcodeChange');
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

The freeRASP contains public API, so the integration process is as simple as possible. Unfortunately, this public API also creates opportunities for the attacker to use publicly available information to interrupt freeRASP operations or modify your custom reaction implementation in threat callbacks. In order for freeRASP to be as effective as possible, it is highly recommended to apply obfuscation to the final package/application, making the public API more difficult to find and also partially randomized for each application so it cannot be automatically abused by generic hooking scripts.

### Android

Some versions of React Native do not use code shrinking and obfuscation by default. However, the owner of the project can define the set of rules that are usually automatically used when the application is built in the release mode. For more information, please visit the official documentation

- https://developer.android.com/studio/build/shrink-code
- https://www.guardsquare.com/manual/configuration/usage

You enable obfuscation by checking the value of **minifyEnabled** property in **android/app/build.gradle** file.

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

freeRASP will notify you about missing obfuscation via `obfuscationIssues` callback.

## Step 6: User Data Policies

See the generic info about freeRASP data collection [here](https://github.com/talsec/Free-RASP-Community/tree/master#data-collection-processing-and-gdpr-compliance).

Google Play [requires](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) all app publishers to declare how they collect and handle user data for the apps they publish on Google Play. They should inform users properly of the data collected by the apps and how the data is shared and processed. Therefore, Google will reject the apps which do not comply with the policy.

Apple has a [similar approach](https://developer.apple.com/app-store/app-privacy-details/) and specifies the types of collected data.

You should also visit our [Android](https://github.com/talsec/Free-RASP-Android) and [iOS](https://github.com/talsec/Free-RASP-iOS) submodules to learn more about their respective data policies.

And you're done 🎉!

If you encounter any other issues, you can see the list of solved issues [here](https://github.com/talsec/Free-RASP-ReactNative/issues?q=is%3Aissue+is%3Aclosed), or open up a [new one](https://github.com/talsec/Free-RASP-ReactNative/issues?q=is%3Aissue+is%3Aopen).

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

# Security Report

The Security Report is a weekly summary describing the application's security state and characteristics of the devices it runs on in a practical and easy-to-understand way.

The report provides a quick overview of the security incidents, their dynamics, app integrity, and reverse engineering attempts. It contains info about the security of devices, such as OS version or the ratio of devices with screen locks and biometrics. Each visualization also comes with a concise explanation.

To receive Security Reports, fill out the _watcherMail_ field in [config](#configuration).

![dashboard](https://raw.githubusercontent.com/talsec/Free-RASP-Community/master/visuals/dashboard.png)

# :bar_chart: Commercial versions (RASP+ and more)

We provide app security hardening SDK: i.e. AppiCrypt®, Customer Data Encryption (local storage), End-to-end encryption, Strings protection (e.g. API keys) and Dynamic Certificate Pinning to our commercial customers as well. To get the most advanced protection compliant with PSD2 RT and eIDAS and support from our experts, contact us at [talsec.app](https://talsec.app).

The commercial version provides a top-notch protection level, extra features, support, and maintenance. One of the most valued commercial features is [AppiCrypt®](https://www.talsec.app/appicrypt) - App Integrity Cryptogram.

It allows easy to implement API protection and App Integrity verification on the backend to prevent API abuse:

- Bruteforce attacks
- Botnets
- Session-hijacking
- DDoS

It is a unified solution that works across all mobile platforms without dependency on external web services (i.e., without extra latency, an additional point of failure, and maintenance costs).

Learn more about commercial features at [https://talsec.app](https://talsec.app/).

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
            <td>Advanced root/jailbreak protections</td>
            <td>basic</td>
            <td>advanced</td>
        </tr>
        <tr>
            <td>Runtime reverse engineering controls
                <ul>
                    <li>Debug</li>
                    <li>Emulator</li>
                    <li>Hooking protections (e.g. Frida)</li>
                </ul>
            </td>
            <td>basic</td>
            <td>advanced</td>
        </tr>
        <tr>
            <td>Runtime integrity controls
                <ul>
                    <li>Tamper protection</li>
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
                </ul>
            </td>
            <td>yes</td>
            <td>yes</td>
        </tr>
        <tr>
            <td>UI protection
                <ul>
                    <li>Overlay protection</li>
                    <li>Accessibility services protection</li>
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
                    <li>Customer Data Encryption (local storage)</li>
                    <li>End-to-end encryption</li>
                    <li>Strings protection (e.g. API keys)</li>
                    <li>Dynamic certificate pinning</li>
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
            <td colspan=5><strong>Monitoring</strong></td>
        </tr>
        <tr>
            <td>AppSec regular email reporting</td>
            <td>yes (up to 100k devices)</td>
            <td>yes</td>
        </tr>
        <tr>
            <td>Data insights and auditing portal</td>
            <td>no</td>
            <td>yes</td>
        </tr>
        <tr>
            <td>Embed code to integrate with portal</td>
            <td>no</td>
            <td>yes</td>
        </tr>
        <tr>
            <td>API data access</td>
            <td>no</td>
            <td>yes</td>
        </tr>
        <tr>
         <td colspan=5><strong>Fair usage policy</strong></td>
        </tr>
        <tr>
            <td>Mentioning of the App name and logo in the marketing communications of Talsec (e.g. "Trusted by" section of the Talsec web or in the social media).</td>
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
