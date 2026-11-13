import { Platform } from 'react-native';
import { FreeraspReactNative } from '../nativeModules';
import type { TalsecConfig } from '../../types/types';
import { androidOnly, wrapNative } from '../../types/errors';
import { withDefaults } from '../../utils/config';

/**
 * Starts freeRASP. Prefer the `useFreeRasp` hook, which also registers the
 * listeners.
 */
export const talsecStart = async (options: TalsecConfig): Promise<void> => {
  await wrapNative('talsec-failure', () =>
    FreeraspReactNative.talsecStart(withDefaults(options))
  );
};

/**
 * Android only. Adds an app to the malware whitelist so it is not reported.
 */
export const addToWhitelist = async (packageName: string): Promise<void> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Malware detection');
  }
  await wrapNative('malware-failure', () =>
    FreeraspReactNative.addToWhitelist(packageName)
  );
};

/**
 * Blocks or unblocks screenshots and screen recording of the app screen.
 */
export const blockScreenCapture = async (enable: boolean): Promise<void> => {
  await wrapNative('talsec-failure', () =>
    FreeraspReactNative.blockScreenCapture(enable)
  );
};

/**
 * Returns whether screen capture is blocked for the current screen.
 */
export const isScreenCaptureBlocked = (): Promise<boolean> => {
  return wrapNative('talsec-failure', () =>
    FreeraspReactNative.isScreenCaptureBlocked()
  );
};

/**
 * Android only. Prevents accessibility services from reading or controlling
 * the app screen.
 */
export const blockScreenControl = async (enable: boolean): Promise<void> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Screen control blocking');
  }
  await wrapNative('talsec-failure', () =>
    FreeraspReactNative.blockScreenControl(enable)
  );
};

/**
 * Android only. Returns whether screen control is blocked.
 */
export const isScreenControlBlocked = (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Screen control blocking');
  }
  return wrapNative('talsec-failure', () =>
    FreeraspReactNative.isScreenControlBlocked()
  );
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
  return wrapNative('talsec-failure', () =>
    FreeraspReactNative.blockOverlayWindows(enable)
  );
};

/**
 * Android only. Returns whether overlay windows of other apps are hidden.
 */
export const isOverlayWindowsBlocked = (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Overlay windows blocking');
  }
  return wrapNative('talsec-failure', () =>
    FreeraspReactNative.isOverlayWindowsBlocked()
  );
};

/**
 * Android only. Starts the ongoing call (cellular and VoIP) detection.
 * Call states are reported through the `ongoingCall` threat action.
 */
export const startOngoingCallDetection = async (): Promise<void> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Ongoing call detection');
  }
  await wrapNative('talsec-failure', () =>
    FreeraspReactNative.startOngoingCallDetection()
  );
};

/**
 * Android only. Stops the ongoing call detection.
 */
export const stopOngoingCallDetection = async (): Promise<void> => {
  if (Platform.OS === 'ios') {
    return androidOnly('Ongoing call detection');
  }
  await wrapNative('talsec-failure', () =>
    FreeraspReactNative.stopOngoingCallDetection()
  );
};

/**
 * Stores an external ID sent with freeRASP logs.
 */
export const storeExternalId = async (data: string): Promise<void> => {
  await wrapNative('external-id-failure', () =>
    FreeraspReactNative.storeExternalId(data)
  );
};

/**
 * Removes the stored external ID.
 */
export const removeExternalId = async (): Promise<void> => {
  await wrapNative('external-id-failure', () =>
    FreeraspReactNative.removeExternalId()
  );
};

/**
 * Android only. Returns the icon of the given app as a base64-encoded PNG.
 */
export const getAppIcon = (packageName: string): Promise<string> => {
  if (Platform.OS === 'ios') {
    return androidOnly('App icon retrieval for malware detection');
  }
  return wrapNative('malware-failure', () =>
    FreeraspReactNative.getAppIcon(packageName)
  );
};
