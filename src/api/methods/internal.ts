import { FreeraspReactNative } from '../nativeModules';

/**
 * Terminates the app. Called when the native side sends data that freeRASP
 * never sends, which indicates tampering. Exported publicly as `abortApp`.
 */
export const onInvalidCallback = (): void => {
  FreeraspReactNative.onInvalidCallback();
};

export const removeListenerForEvent = (channel: string): Promise<string> => {
  return FreeraspReactNative.removeListenerForEvent(channel);
};
