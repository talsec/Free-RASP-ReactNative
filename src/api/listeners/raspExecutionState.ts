import { NativeEventEmitter, type EmitterSubscription } from 'react-native';
import { FreeraspReactNative } from '../nativeModules';
import { onInvalidCallback } from '../methods/native';
import type {
  NativeEvent,
  RaspExecutionStateEventActions,
} from '../../types/types';
import {
  getRaspExecutionStateChannelData,
  prepareRaspExecutionStateMapping,
} from '../../channels/raspExecutionState';
import { RaspExecutionState } from '../../models/raspExecutionState';

const eventEmitter = new NativeEventEmitter(FreeraspReactNative);
let eventsListener: EmitterSubscription | undefined;

export const setRaspExecutionStateListener = async (
  config: RaspExecutionStateEventActions
) => {
  const [channel, key] = await getRaspExecutionStateChannelData();
  await prepareRaspExecutionStateMapping();

  const listener = async (event: NativeEvent) => {
    if (event[key] === undefined) {
      onInvalidCallback();
    }
    switch (event[key]) {
      case RaspExecutionState.AllChecksFinished.value:
        config.allChecksFinished?.();
        break;
      default:
        onInvalidCallback();
        break;
    }
  };
  eventsListener = eventEmitter.addListener(channel, listener);
};

export const removeRaspExecutionStateEventListener = (): void => {
  eventsListener?.remove();
  eventsListener = undefined;
};
