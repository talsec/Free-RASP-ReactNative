

![FreeRasp](https://raw.githubusercontent.com/talsec/Free-RASP-Community/master/visuals/freeRASPforRN.png)

![GitHub Repo stars](https://img.shields.io/github/stars/talsec/Free-RASP-Community?color=green) ![GitHub](https://img.shields.io/github/license/talsec/Free-RASP-Community) ![GitHub](https://img.shields.io/github/last-commit/talsec/Free-RASP-Community) ![Publisher](https://img.shields.io/pub/publisher/freerasp)
# freeRASP for React Native

freeRASP for React Native is a mobile in-app protection and security monitoring plugin. It aims to cover the main aspects of RASP (Runtime App Self Protection) and application shielding.

# :notebook_with_decorative_cover: Table of contents

- [Overview](#overview)
- [Usage](#usage)
  * [(Optional) Create a new React Native demo application](#optional-create-a-new-react-native-demo-application)
  * [Step 1: Install the plugin](#step-1-install-the-plugin)
  * [Step 2: Set up the dependencies](#step-2-set-up-the-dependencies)
  * [Step 3: Dev vs Release version](#step-3-dev-vs-release-version)
  * [Step 4: Import freeRASP into the app](#step-4-import-freerasp-into-the-app)
  * [Step 5: Setup the configuration, callbacks and initialize freeRASP](#step-5-setup-the-configuration-callbacks-and-initialize-freerasp)
  * [Step 6: User Data Policies](#step-6-user-data-policies)
- [Security Report](#security-report)
- [Enterprise Services](#bar_chart-enterprise-services)
  * [Plans Comparison](#plans-comparison)

# Overview

The freeRASP is available for Flutter, Cordova, React Native, Android, and iOS developers. We encourage community contributions, investigations of attack cases, joint data research, and other activities aiming to make better app security and app safety for end-users.

freeRASP plugin is designed to combat

* Reverse engineering attempts
* Re-publishing or tampering with the apps
* Running application in a compromised OS environment
* Malware, fraudsters, and cybercriminal activities

Key features are the detection and prevention of

* Root/Jailbreak (e.g., unc0ver, check1rain)
* Hooking framework (e.g., Frida, Shadow)
* Untrusted installation method
* App/Device (un)binding

Additional freeRASP features include low latency, easy integration and a weekly [Security Report](#security-report) containing detailed information about detected incidents and potential threats, summarizing the state of your app security.

The commercial version provides a top-notch protection level, extra features, support and maintenance. One of the most valued commercial features is AppiCrypt® - App Integrity Cryptogram.

It allows easy to implement API protection and App Integrity verification on the backend to prevent API abuse:

* Bruteforce attacks
* Botnets
* Session-hijacking
* DDoS

It is a unified solution that works across all mobile platforms without dependency on external web services (i.e., without extra latency, an additional point of failure, and maintenance costs).

Learn more about commercial features at [https://talsec.app](https://talsec.app).

Learn more about freemium freeRASP features at [GitHub main repository](https://github.com/talsec/Free-RASP-Community).

# Usage

We will guide you step-by-step, but you can always check the expected result in the example.


## (Optional) Create a new React Native demo application
Create a new React Native project:

    $ npx react-native init AwesomeProject

## Step 1: Install the plugin

    $ npm install https://github.com/talsec/Free-RASP-ReactNative.git

or

    $ yarn add https://github.com/talsec/Free-RASP-ReactNative.git

## Step 2: Set up the dependencies
### Android
freeRASP needs to have access to the maven repository containing freeRASP. Add following lines into the `android/build.gradle` file, in the `allprojects.repositories` section:
```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
        ... your repositories
        maven{url = uri("https://nexus3-public.monetplus.cz/repository/ahead-talsec-free-rasp")}
        maven{url = uri("https://developer.huawei.com/repo/")}
        maven{url = uri("https://jitpack.io")}
    }
}
```

### iOS
freeRASP React Native plugin uses Pods. Navigate to the `ios` folder and run:

    $ pod install


## Step 3: Dev vs Release version
The Dev version is used to not complicate the development process of the application, e.g. if you would implement killing of the application on the debugger callback. It disables some checks which won't be triggered during the development process:

* Emulator-usage (simulator)
* Debugging (debug)
* Signing (appIntegrity)
* Unofficial store (unofficialStore)

Which version of freeRASP is used is tied to the application's development stage - more precisely, how the application is compiled.

### Android
Android implementation of the React Native plugin detects selected development stage and automatically applies the suitable version of the library.

* `npx react-native run-android` (debug) -> uses dev version of freeRASP
* `npx react-native run-android --variant release` (release) -> uses release version of freeRASP

### iOS
For the iOS implemtation, it's neccesary to add script into the Xcode environment, that automatically switches between the library dev/release versions according to selected development stage. Then, it is necessary to embedd a symlink to correct TalsecRuntime.xcframework.

1. Add pre-built script for changing the Debug and Release versions of the framework:
   * Open up the **.xcworkspace** file
   * Go to **Product** -> **Scheme** -> **Edit Scheme...** -> **Build (dropdown arrow)** -> **Pre-actions**
   * Hit  **+**  and then  **New Run Script Action**
   * Set  **Provide build setting from**  to  your application
   * Copy-paste following script:
        ```shell
        cd "${SRCROOT}/../node_modules/freerasp-react-native/ios"
        if [ "${CONFIGURATION}" = "Release" ]; then
            rm -rf ./TalsecRuntime.xcframework
            ln -s ./Release/TalsecRuntime.xcframework/ TalsecRuntime.xcframework
        else
            rm -rf ./TalsecRuntime.xcframework
            ln -s ./Debug/TalsecRuntime.xcframework/ TalsecRuntime.xcframework
        fi
        ```
   * **Close**
3. Add dependency on the symlink
   * Go to your **Target** -> **Build Phases** -> **Link Binary With Libraries**
   * Add dependency (drag & drop right after **libPods**) on the symlink on the following location:
     *AwesomeProject/node_modules/freerasp-react-native/ios/TalsecRuntime.xcframework*
   * If there is no symlink, try to create it manually in that folder by the following command:
   *     $ ln -s ./Debug/TalsecRuntime.xcframework/ TalsecRuntime.xcframework


Followingly:
* `npx react-native run-ios` (debug) -> uses dev version of freeRASP
* `npx react-native run-ios --configuration Release` (release) -> uses release version of freeRASP

## Step 4: Import freeRASP into the app

We provide a custom hook that handles all required logic as registration of freeRASP, mounting and unmounting of listeners for you. Import the hook into your app:

```ts
import { useFreeRasp } from 'freerasp-react-native';
```

## Step 5: Setup the configuration, callbacks and initialize freeRASP
First, the configuration and callbacks will be explained. Then the **Initialization** chapter shows the implementation.
### Configuration
You need to provide configuration for freeRASP to work properly and initialize it. The freeRASP configuration contains configs for both Android and iOS. You must fill all the required values for the plugin to work.

For Android:
  - `packageName` - package name of your app you chose when you created it
  - `certificateHashes` - hash of the certificate of the key which was used to sign the application. **Hash which is passed here must be encoded in Base64 form.** If you are not sure how to get your certificate hash, you can check out the guide on our [Github wiki](https://github.com/talsec/Free-RASP-Community/wiki/Getting-your-signing-certificate-hash-of-app). Multiple hashes are supported, e.g. if you are using a different one for the Huawei App Gallery.
  - `supportedAlternativeStores` _(optional)_ - If you publish on the Google Play Store and/or Huawei AppGallery, you **don't have to assign anything** there as those are supported out of the box.

For iOS similarly to Android, `appBundleId` and `appTeamId` are required.

Lastly, pass a mail address to `watcherMail` to be able to get reports. Mail has a strict form `name@domain.com` which is passed as String.

### Callbacks

freeRASP executes periodical checks when the application is running. Handle the detected threats in the **listeners**. For example, you can log the event, show a window to the user or kill the application. Visit our [wiki](https://github.com/talsec/Free-RASP-Community/wiki/Threat-detection) to learn more details about the performed checks and their importance for app security.

### Initialization

You should initialize the freeRASP in the entry point to your app, which is usually in `App.jsx` or `App.tsx`. Just copy & paste this code inside your root component / function, then setup the configuration and reactions to listeners:

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
};

// reactions for detected threats
const actions = {
  // Android & iOS
  'privilegedAccess': () => {
    console.log('privilegedAccess');
  },
  // Android & iOS
  'debug': () => {
    console.log('debug');
  },
  // Android & iOS
  'simulator': () => {
    console.log('simulator');
  },
  // Android & iOS
  'appIntegrity': () => {
    console.log('appIntegrity');
  },
  // Android & iOS
  'unofficialStore': () => {
    console.log('unofficialStore');
  },
  // Android & iOS
  'hooks': () => {
    console.log('hooks');
  },
  // Android & iOS
  'device binding': () => {
    console.log('device binding');
  },
  // iOS only
  'deviceID': () => {
    console.log('deviceID');
  },
  // iOS only
  'missingSecureEnclave': () => {
    console.log('missingSecureEnclave');
  },
  // iOS only
  'passcodeChange': () => {
    console.log('passcodeChange');
  },
  // iOS only
  'passcode': () => {
    console.log('passcode');
  },
};

useFreeRasp(config, actions);
```

When freeRASP initializes correctly, you should see `freeRASP initialized` message in logs. Otherwise, you'll see warning with description of what went wrong.

_You can override this default behavior by extending the `actions` object with `'started'` key (to change action after successful initialization), and `'initializationError'` key (to set up action after unsuccessful initialization)_

## Step 6: User Data Policies

Google Play [requires](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) all app publishers to declare how they collect and handle user data for the apps they publish on Google Play. They should inform users properly of the data collected by the apps and how the data is shared and processed. Therefore, Google will reject the apps which do not comply with the policy.

Apple has a [similar approach](https://developer.apple.com/app-store/app-privacy-details/) and specifies the types of collected data.

You should also visit our [Android](https://github.com/talsec/Free-RASP-Android) and [iOS](https://github.com/talsec/Free-RASP-iOS) submodules to learn more about their respective data policies.

And you're done 🎉!

If you encounter any other issues, you can see the list of solved issues [here](https://github.com/talsec/Free-RASP-ReactNative/issues?q=is%3Aissue+is%3Aclosed), or open up a [new one](https://github.com/talsec/Free-RASP-ReactNative/issues?q=is%3Aissue+is%3Aopen).

# Security Report

The Security Report is a weekly summary describing the application's security state and characteristics of the devices it runs on in a practical and easy-to-understand way.

The report provides a quick overview of the security incidents, their dynamics, app integrity, and reverse engineering attempts. It contains info about the security of devices, such as OS version or the ratio of devices with screen locks and biometrics. Each visualization also comes with a concise explanation.

To receive Security Reports, fill out the _watcherMail_ field in [config](#step-3-setup-the-configuration-for-your-app).

![dashboard](https://raw.githubusercontent.com/talsec/Free-RASP-Community/master/visuals/dashboard.png)

# :bar_chart: Enterprise Services
We provide app security hardening SDK: i.e. AppiCrypt®, Customer Data Encryption (local storage), End-to-end encryption, Strings protection (e.g. API keys) and Dynamic Certificate Pinning to our commercial customers as well. To get the most advanced protection compliant with PSD2 RT and eIDAS and support from our experts, contact us at [talsec.app](https://talsec.app).

## Commercial version
The commercial version provides a top-notch protection level, extra features, support, and maintenance. One of the most valued commercial features is [AppiCrypt®](https://www.talsec.app/appicrypt) - App Integrity Cryptogram.

It allows easy to implement API protection and App Integrity verification on the backend to prevent API abuse:

-   Bruteforce attacks
-   Botnets
-   Session-hijacking
-   DDoS

It is a unified solution that works across all mobile platforms without dependency on external web services (i.e., without extra latency, an additional point of failure, and maintenance costs).

Learn more about commercial features at  [https://talsec.app](https://talsec.app/).

**TIP:** You can try freeRASP and then upgrade easily to an enterprise service.


## Plans Comparison

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
         <td colspan=5><strong>Fair usage policy</strong></td>
        </tr>
        <tr>
            <td>Mentioning of the app name in Talsec marketing communication (e.g. "Trusted by Talsec section" on social media)</td>
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
