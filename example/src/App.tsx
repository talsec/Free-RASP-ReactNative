import * as React from 'react';

import { Platform } from 'react-native';
import { useFreeRasp } from 'freerasp-react-native';
import { DemoApp } from './DemoApp';
import { commonChecks, iosChecks, androidChecks } from './checks';

const App = () => {
  const [appChecks, setAppChecks] = React.useState([
    ...commonChecks,
    ...(Platform.OS === 'ios' ? iosChecks : androidChecks),
  ]);

  const config = {
    androidConfig: {
      packageName: 'com.freeraspreactnativeexample',
      certificateHashes: ['your_signing_certificate_hash_base64'],
      // supportedAlternativeStores: ['storeOne', 'storeTwo'],
    },
    iosConfig: {
      appBundleId: 'com.freeraspreactnativeexample',
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
  };

  useFreeRasp(config, actions);

  return <DemoApp checks={appChecks} />;
};

export default App;
