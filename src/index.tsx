import { useEffect } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  type EmitterSubscription,
} from 'react-native';
import type {
  NativeEventEmitterActions,
  PackageInfo,
  SuspiciousAppInfo,
  TalsecConfig,
} from './types';
import { getThreatCount, itemsHaveType } from './utils';
import { Buffer } from 'buffer';
import { Threat } from './threat';

const { FreeraspReactNative } = NativeModules;

const eventEmitter = new NativeEventEmitter(FreeraspReactNative);
let eventsListener: EmitterSubscription;

const onInvalidCallback = (): void => {
  FreeraspReactNative.onInvalidCallback();
};

const getThreatIdentifiers = async (): Promise<number[]> => {
  let identifiers = await FreeraspReactNative.getThreatIdentifiers();
  if (
    identifiers.length !== getThreatCount() ||
    !itemsHaveType(identifiers, 'number')
  ) {
    onInvalidCallback();
  }
  return identifiers;
};

const getThreatChannelData = async (): Promise<[string, string, string]> => {
  const dataLength = Platform.OS === 'ios' ? 2 : 3;
  let data = await FreeraspReactNative.getThreatChannelData();
  if (data.length !== dataLength || !itemsHaveType(data, 'string')) {
    onInvalidCallback();
  }
  return data;
};

const prepareMapping = async (): Promise<void> => {
  const newValues = await getThreatIdentifiers();
  const threats = Threat.getValues();

  threats.map((threat, index) => {
    threat.value = newValues[index]!;
  });
};

// parses base64-encoded malware data to SuspiciousAppInfo[]
const parseMalwareData = async (
  data: string[]
): Promise<SuspiciousAppInfo[]> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(data.map((entry) => toSuspiciousAppInfo(entry)));
    } catch (error: any) {
      reject(`Error while parsing app data: ${error}`);
    }
  });
};

const toSuspiciousAppInfo = (base64Value: string): SuspiciousAppInfo => {
  const data = JSON.parse(Buffer.from(base64Value, 'base64').toString('utf8'));
  const packageInfo = data.packageInfo as PackageInfo;
  return { packageInfo, reason: data.reason } as SuspiciousAppInfo;
};

export const setThreatListeners = async <T extends NativeEventEmitterActions>(
  config: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>
) => {
  const [channel, key, malwareKey] = await getThreatChannelData();
  await prepareMapping();

  eventsListener = eventEmitter.addListener(channel, async (event) => {
    if (event[key] === undefined) {
      onInvalidCallback();
    }
    switch (event[key]) {
      case Threat.PrivilegedAccess.value:
        config.privilegedAccess?.();
        break;
      case Threat.Debug.value:
        config.debug?.();
        break;
      case Threat.Simulator.value:
        config.simulator?.();
        break;
      case Threat.AppIntegrity.value:
        config.appIntegrity?.();
        break;
      case Threat.UnofficialStore.value:
        config.unofficialStore?.();
        break;
      case Threat.Hooks.value:
        config.hooks?.();
        break;
      case Threat.DeviceBinding.value:
        config.deviceBinding?.();
        break;
      case Threat.Passcode.value:
        config.passcode?.();
        break;
      case Threat.SecureHardwareNotAvailable.value:
        config.secureHardwareNotAvailable?.();
        break;
      case Threat.ObfuscationIssues.value:
        config.obfuscationIssues?.();
        break;
      case Threat.DeviceID.value:
        config.deviceID?.();
        break;
      case Threat.DevMode.value:
        config.devMode?.();
        break;
      case Threat.SystemVPN.value:
        config.systemVPN?.();
        break;
      case Threat.Malware.value:
        config.malware?.(await parseMalwareData(event[malwareKey]));
        break;
      case Threat.ADBEnabled.value:
        config.adbEnabled?.();
        break;
      case Threat.Screenshot.value:
        config.screenshot?.();
        break;
      case Threat.ScreenRecording.value:
        config.screenRecording?.();
        break;
      default:
        onInvalidCallback();
        break;
    }
  });
};

export const removeThreatListeners = (): void => {
  eventsListener.remove();
};

export const talsecStart = async (options: TalsecConfig): Promise<string> => {
  return FreeraspReactNative.talsecStart(options);
};

export const useFreeRasp = <T extends NativeEventEmitterActions>(
  config: TalsecConfig,
  actions: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>
) => {
  useEffect(() => {
    (async () => {
      await setThreatListeners(actions);
      try {
        let response = await talsecStart(config);
        if (response !== 'freeRASP started') {
          onInvalidCallback();
        }
        console.log(response);
      } catch (e: any) {
        console.error(`${e.code}: ${e.message}`);
      }

      return () => {
        removeThreatListeners();
      };
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const addToWhitelist = async (packageName: string): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return Promise.reject('Malware detection not available on iOS');
  }
  return FreeraspReactNative.addToWhitelist(packageName);
};

export const getAppIcon = (packageName: string): Promise<string> => {
  if (Platform.OS === 'ios') {
    return Promise.reject(
      'App icon retrieval for Malware detection not available on iOS'
    );
  }
  return FreeraspReactNative.getAppIcon(packageName);
};

export const blockScreenCapture = (enable: boolean): Promise<string> => {
  if (Platform.OS === 'ios') {
    return Promise.reject(
      'Blocking/Unblocking Screen Capture not available on iOS'
    );
  }
  return FreeraspReactNative.blockScreenCapture(enable);
};

export const isScreenCaptureBlocked = (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return Promise.reject(
      'Checking Screen Capture status not available on iOS'
    );
  }
  return FreeraspReactNative.isScreenCaptureBlocked();
};

export * from './types';
export default FreeraspReactNative;
