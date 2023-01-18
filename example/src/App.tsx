import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { useFreeRasp } from 'freerasp-react-native';

const App = () => {
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
  };

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

  return (
    <View style={styles.container}>
      <Text>Hello from the freeRASP app!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

export default App;
