import { Platform } from 'react-native';
import { FreeraspReactNative } from '../nativeModules';
import type { TalsecConfig } from '../../types/types';

export const talsecStart = async (options: TalsecConfig): Promise<string> => {
  return FreeraspReactNative.talsecStart(options);
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
