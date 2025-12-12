import { NativeEventEmitter, type EmitterSubscription } from 'react-native';
import { FreeraspReactNative } from '../nativeModules';
import { onInvalidCallback } from '../methods/native';
import { Threat } from '../../models/threat';
import type { NativeEvent, ThreatEventActions } from '../../types/types';
import { parseMalwareData } from '../../utils/malware';
import {
  getThreatChannelData,
  prepareThreatMapping,
} from '../../channels/threat';

const eventEmitter = new NativeEventEmitter(FreeraspReactNative);
let eventsListener: EmitterSubscription | undefined;

export const setThreatListeners = async (config: ThreatEventActions) => {
  const [channel, key, malwareKey] = await getThreatChannelData();
  await prepareThreatMapping();

  const listener = async (event: NativeEvent) => {
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
        const malwareData = event[malwareKey];
        config.malware?.(
          await parseMalwareData(Array.isArray(malwareData) ? malwareData : [])
        );
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
      case Threat.MultiInstance.value:
        config.multiInstance?.();
        break;
      case Threat.TimeSpoofing.value:
        config.timeSpoofing?.();
        break;
      case Threat.LocationSpoofing.value:
        config.locationSpoofing?.();
        break;
      case Threat.UnsecureWifi.value:
        config.unsecureWifi?.();
        break;
      default:
        onInvalidCallback();
        break;
    }
  };
  eventsListener = eventEmitter.addListener(channel, listener);
};

export const removeThreatListener = (): void => {
  eventsListener?.remove();
  eventsListener = undefined;
};
