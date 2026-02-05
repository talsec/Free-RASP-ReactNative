import { NativeEventEmitter, type EmitterSubscription } from 'react-native';
import { FreeraspReactNative } from '../nativeModules';
import { onInvalidCallback, removeListenerForEvent } from '../methods/native';
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
let eventsListener: EmitterSubscription | null = null;
let executionStateChannel: string | null = null;
let executionStateKey: string | null = null;

let isMappingPrepared = false;
let isInitializing = false;

export const setRaspExecutionStateListener = async (
  config: RaspExecutionStateEventActions
) => {
  if (eventsListener || isInitializing) {
    return;
  }

  isInitializing = true;

  if (!executionStateChannel || !executionStateKey) {
    [executionStateChannel, executionStateKey] =
      await getRaspExecutionStateChannelData();
  }

  if (!isMappingPrepared) {
    await prepareRaspExecutionStateMapping();
    isMappingPrepared = true;
  }

  const listener = async (event: NativeEvent) => {
    if (!executionStateKey) {
      onInvalidCallback();
      return;
    }

    switch (event[executionStateKey]) {
      case RaspExecutionState.AllChecksFinished.value:
        config.allChecksFinished?.();
        break;
      default:
        onInvalidCallback();
        break;
    }
  };
  eventsListener = eventEmitter.addListener(executionStateChannel, listener);
  isInitializing = false;
};

export const removeRaspExecutionStateEventListener =
  async (): Promise<void> => {
    if (!eventsListener || !executionStateChannel) {
      return;
    }
    await removeListenerForEvent(executionStateChannel);
    eventsListener?.remove();
    eventsListener = null;
  };
