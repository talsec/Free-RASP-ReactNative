import { NativeEventEmitter, type EmitterSubscription } from 'react-native';
import { FreeraspReactNative } from '../nativeModules';
import { onInvalidCallback, removeListenerForEvent } from '../methods/native';
import { Threat } from '../../models/threat';
import type { NativeEvent, ThreatEventActions } from '../../types/types';
import { parseMalwareData } from '../../utils/malware';
import {
  getThreatChannelData,
  prepareThreatMapping,
} from '../../channels/threat';

const eventEmitter = new NativeEventEmitter(FreeraspReactNative);
let eventsListener: EmitterSubscription | null = null;

let threatChannel: string | null = null;
let threatKey: string | null = null;
let threatMalwareKey: string | null = null;

let isMappingPrepared = false;
let isInitializing = false;

export const setThreatListeners = async (config: ThreatEventActions) => {
  if (isInitializing) {
    return;
  }

  isInitializing = true;

  await removeThreatListener();

  if (!threatChannel || !threatKey || !threatMalwareKey) {
    [threatChannel, threatKey, threatMalwareKey] = await getThreatChannelData();
  }

  if (!isMappingPrepared) {
    await prepareThreatMapping();
    isMappingPrepared = true;
  }

  const listener = async (event: NativeEvent) => {
    if (!threatKey || !threatMalwareKey) {
      onInvalidCallback();
      return;
    }

    switch (event[threatKey]) {
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
        const malwareData = event[threatMalwareKey];
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
  eventsListener = eventEmitter.addListener(threatChannel, listener);
  isInitializing = false;
};

export const removeThreatListener = async (): Promise<void> => {
  if (!eventsListener || !threatChannel) {
    return;
  }
  await removeListenerForEvent(threatChannel);
  eventsListener?.remove();
  eventsListener = null;
};
