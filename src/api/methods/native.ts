import { Platform } from 'react-native';
import { FreeraspReactNative } from '../nativeModules';
import type {
  MalwareScanScope,
  ReasonMode,
  SuspiciousAppDetectionConfig,
  TalsecAndroidConfig,
  TalsecConfig,
} from '../../types/types';

const DEFAULT_MALWARE_SCAN_SCOPE: MalwareScanScope = {
  scanScope: 'SIDELOADED_ONLY',
};

const DEFAULT_REASON_MODE: ReasonMode = 'HIGHEST_CONFIDENCE';

const withSuspiciousAppDetectionDefaults = (
  config: SuspiciousAppDetectionConfig
): SuspiciousAppDetectionConfig => ({
  ...config,
  malwareScanScope: config.malwareScanScope ?? DEFAULT_MALWARE_SCAN_SCOPE,
  reasonMode: config.reasonMode ?? DEFAULT_REASON_MODE,
});

const normalizeAndroidConfig = (
  androidConfig: TalsecAndroidConfig
): TalsecAndroidConfig => {
  if (!androidConfig.suspiciousAppDetectionConfig) {
    return androidConfig;
  }
  return {
    ...androidConfig,
    suspiciousAppDetectionConfig: withSuspiciousAppDetectionDefaults(
      androidConfig.suspiciousAppDetectionConfig
    ),
  };
};

const normalizeConfig = (options: TalsecConfig): TalsecConfig => ({
  ...options,
  androidConfig: options.androidConfig
    ? normalizeAndroidConfig(options.androidConfig)
    : undefined,
});

export const talsecStart = async (options: TalsecConfig): Promise<string> => {
  return FreeraspReactNative.talsecStart(normalizeConfig(options));
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
