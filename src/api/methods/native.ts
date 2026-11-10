import { Platform } from 'react-native';
import { FreeraspReactNative } from '../nativeModules';
import type { TalsecConfig } from '../../types/types';
import { withDefaults } from '../../utils/config';

export const talsecStart = async (options: TalsecConfig): Promise<string> => {
  return FreeraspReactNative.talsecStart(withDefaults(options));
};

export const addToWhitelist = async (packageName: string): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return Promise.reject('Malware detection not available on iOS');
  }
  return FreeraspReactNative.addToWhitelist(packageName);
};

export const blockScreenCapture = (enable: boolean): Promise<string> => {
  return FreeraspReactNative.blockScreenCapture(enable);
};

export const isScreenCaptureBlocked = (): Promise<boolean> => {
  return FreeraspReactNative.isScreenCaptureBlocked();
};

const androidOnly = (feature: string): Promise<never> =>
  Promise.reject(`${feature} not available on iOS`);

/**
 * Android only. Prevents accessibility services from reading or controlling
 * the app screen.
 */
export const blockScreenControl = (enable: boolean): Promise<string> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Screen control blocking');
  }
  return FreeraspReactNative.blockScreenControl(enable);
};

/**
 * Android only. Returns whether screen control is blocked.
 */
export const isScreenControlBlocked = (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Screen control blocking');
  }
  return FreeraspReactNative.isScreenControlBlocked();
};

/**
 * Android only. Hides overlay windows of other apps over the app screen.
 * Requires Android 12+ and the `HIDE_OVERLAY_WINDOWS` permission.
 *
 * @returns whether the request was applied
 */
export const blockOverlayWindows = (enable: boolean): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Overlay windows blocking');
  }
  return FreeraspReactNative.blockOverlayWindows(enable);
};

/**
 * Android only. Returns whether overlay windows of other apps are hidden.
 */
export const isOverlayWindowsBlocked = (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Overlay windows blocking');
  }
  return FreeraspReactNative.isOverlayWindowsBlocked();
};

/**
 * Android only. Starts the ongoing call (cellular and VoIP) detection.
 * Call states are reported through the `ongoingCall` threat action.
 */
export const startOngoingCallDetection = (): Promise<string> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Ongoing call detection');
  }
  return FreeraspReactNative.startOngoingCallDetection();
};

/**
 * Android only. Stops the ongoing call detection.
 */
export const stopOngoingCallDetection = (): Promise<string> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Ongoing call detection');
  }
  return FreeraspReactNative.stopOngoingCallDetection();
};

export const storeExternalId = (data: string): Promise<string> => {
  return FreeraspReactNative.storeExternalId(data);
};

export const removeExternalId = (): Promise<string> => {
  return FreeraspReactNative.removeExternalId();
};

export const getAppIcon = (packageName: string): Promise<string> => {
  if (Platform.OS === 'ios') {
    return Promise.reject(
      'App icon retrieval for Malware detection not available on iOS'
    );
  }
  return FreeraspReactNative.getAppIcon(packageName);
};

export const onInvalidCallback = (): void => {
  FreeraspReactNative.onInvalidCallback();
};

export const removeListenerForEvent = (channel: string): Promise<string> => {
  return FreeraspReactNative.removeListenerForEvent(channel);
};
