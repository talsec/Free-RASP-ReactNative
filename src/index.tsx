import { useEffect } from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

type TalsecConfig = {
  androidConfig: {
    packageName: string;
    certificateHashes: string[];
    supportedAlternativeStores?: string[];
  };
  iosConfig: {
    appBundleId: string;
    appTeamId: string;
  };
  watcherMail: string;
};

type NativeEventEmitterActions = {
  'privilegedAccess'?: () => any;
  'debug'?: () => any;
  'simulator'?: () => any;
  'appIntegrity'?: () => any;
  'unofficialStore'?: () => any;
  'hooks'?: () => any;
  'device binding'?: () => any;
  'deviceID'?: () => any;
  'passcodeChange'?: () => any;
  'passcode'?: () => any;
  'hardwareBackedKeystoreNotAvailable'?: () => any;
  'started'?: () => any;
  'initializationError'?: (reason: { message: string }) => any;
};

const { FreeraspReactNative } = NativeModules;

const eventEmitter = new NativeEventEmitter(FreeraspReactNative);
const activeListeners: EmitterSubscription[] = [];

export const setThreatListeners = <T extends NativeEventEmitterActions>(
  config: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>
) => {
  activeListeners.push(
    eventEmitter.addListener('started', () => {
      console.log('Talsec initialized.');
    })
  );

  activeListeners.push(
    eventEmitter.addListener(
      'initializationError',
      (e: { message: string }) => {
        console.warn(
          `Error during Talsec Native plugin initialization - ${e.message}`
        );
      }
    )
  );

  for (const [threat, action] of Object.entries(config)) {
    activeListeners.push(eventEmitter.addListener(threat, action));
  }
};

export const removeThreatListeners = () => {
  activeListeners.forEach((listener) => listener.remove());
};

export const talsecStart = (options: TalsecConfig): void => {
  return FreeraspReactNative.talsecStart(options);
};

export const useFreeRasp = <T extends NativeEventEmitterActions>(
  config: TalsecConfig,
  actions: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>
) => {
  useEffect(() => {
    setThreatListeners(actions);
    talsecStart(config);

    return () => {
      removeThreatListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default FreeraspReactNative;
