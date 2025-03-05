import * as React from 'react';

import { Platform } from 'react-native';
import {
  addToWhitelist,
  useFreeRasp,
  type SuspiciousAppInfo,
} from 'freerasp-react-native';
import { DemoApp } from './DemoApp';
import { commonChecks, iosChecks, androidChecks } from './checks';
import { useEffect } from 'react';

const App = () => {
  const [appChecks, setAppChecks] = React.useState([
    ...commonChecks,
    ...(Platform.OS === 'ios' ? iosChecks : androidChecks),
  ]);
  const [suspiciousApps, setSuspiciousApps] = React.useState<
    SuspiciousAppInfo[]
  >([]);

  useEffect(() => {
    (async () => {
      Platform.OS === 'android' && (await addItemsToMalwareWhitelist());
    })();
  }, []);

  const config = {
    androidConfig: {
      packageName: 'com.freeraspreactnativeexample',
      certificateHashes: ['AKoRuyLMM91E7lX/Zqp3u4jMmd0A7hH/Iqozu0TMVd0='],
      // supportedAlternativeStores: ['storeOne', 'storeTwo'],
      malwareConfig: {
        blacklistedHashes: ['FgvSehLMM91E7lX/Zqp3u4jMmd0A7hH/Iqozu0TMVd0u'],
        blacklistedPackageNames: ['com.freeraspreactnativeexample'],
        suspiciousPermissions: [
          [
            'android.permission.INTERNET',
            'android.permission.ACCESS_COARSE_LOCATION',
          ],
          ['android.permission.BLUETOOTH'],
          ['android.permission.BATTERY_STATS'],
        ],
        whitelistedInstallationSources: ['com.apkpure.aegon'],
      },
    },
    iosConfig: {
      appBundleId: 'org.reactjs.native.example.FreeraspReactNativeExample',
      appTeamId: 'your_team_ID',
    },
    watcherMail: 'your_email_address@example.com',
    isProd: true,
  };

  const actions = {
    // Android & iOS
    privilegedAccess: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Privileged Access'
            ? { ...threat, status: 'nok' }
            : threat
        )
      );
    },
    // Android & iOS
    debug: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Debug' ? { ...threat, status: 'nok' } : threat
        )
      );
    },
    // Android & iOS
    simulator: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Simulator' ? { ...threat, status: 'nok' } : threat
        )
      );
    },
    // Android & iOS
    appIntegrity: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'App Integrity'
            ? { ...threat, status: 'nok' }
            : threat
        )
      );
    },
    // Android & iOS
    unofficialStore: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Unofficial Store'
            ? { ...threat, status: 'nok' }
            : threat
        )
      );
    },
    // Android & iOS
    hooks: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Hooks' ? { ...threat, status: 'nok' } : threat
        )
      );
    },
    // Android & iOS
    deviceBinding: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Device Binding'
            ? { ...threat, status: 'nok' }
            : threat
        )
      );
    },
    // Android & iOS
    secureHardwareNotAvailable: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Secure Hardware Not Available'
            ? { ...threat, status: 'nok' }
            : threat
        )
      );
    },
    // Android & iOS
    systemVPN: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'System VPN' ? { ...threat, status: 'nok' } : threat
        )
      );
    },
    // Android & iOS
    passcode: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Passcode' ? { ...threat, status: 'nok' } : threat
        )
      );
    },
    // iOS only
    deviceID: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Device ID' ? { ...threat, status: 'nok' } : threat
        )
      );
    },
    // Android only
    obfuscationIssues: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Obfuscation Issues'
            ? { ...threat, status: 'nok' }
            : threat
        )
      );
    },
    // Android only
    devMode: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Developer Mode'
            ? { ...threat, status: 'nok' }
            : threat
        )
      );
    },
    // Android only
    malware: (detectedApps: SuspiciousAppInfo[]) => {
      setSuspiciousApps(detectedApps);
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Malware' ? { ...threat, status: 'nok' } : threat
        )
      );
    },
    // Android only
    adbEnabled: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'ADB Enabled' ? { ...threat, status: 'nok' } : threat
        )
      );
    },
    // Android & iOS
    screenshot: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Screenshot' ? { ...threat, status: 'nok' } : threat
        )
      );
    },
    // Android & iOS
    screenRecording: () => {
      setAppChecks((currentState) =>
        currentState.map((threat) =>
          threat.name === 'Screen Recording'
            ? { ...threat, status: 'nok' }
            : threat
        )
      );
    },
  };

  const addItemsToMalwareWhitelist = async () => {
    const appsToWhitelist = [
      'com.talsecreactnativesecuritypluginexample',
      'com.example.myApp',
    ];
    await Promise.all(
      appsToWhitelist.map(async (app) => {
        try {
          const whitelistResponse = await addToWhitelist(app);
          console.info(
            `${app} stored to Malware Whitelist: ${whitelistResponse}`
          );
        } catch (error) {
          console.info('Malware whitelist failed: ', error);
        }
      })
    );
  };

  useFreeRasp(config, actions);

  return <DemoApp checks={appChecks} suspiciousApps={suspiciousApps} />;
};

export default App;
