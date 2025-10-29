import { getRaspExecutionStateCount, itemsHaveType } from '../utils/utils';
import { FreeraspReactNative } from '../api/nativeModules';
import { onInvalidCallback } from '../api/methods/native';
import { RaspExecutionState } from '../models/raspExecutionState';

export const getRaspExecutionStateIdentifiers = async (): Promise<number[]> => {
  const identifiers =
    await FreeraspReactNative.getRaspExecutionStateIdentifiers();
  if (
    identifiers.length !== getRaspExecutionStateCount() ||
    !itemsHaveType(identifiers, 'number')
  ) {
    onInvalidCallback();
  }
  return identifiers;
};

export const getRaspExecutionStateChannelData = async (): Promise<
  [string, string]
> => {
  const dataLength = 2;
  const data = await FreeraspReactNative.getRaspExecutionStateChannelData();
  if (data.length !== dataLength || !itemsHaveType(data, 'string')) {
    onInvalidCallback();
  }
  return data;
};

export const prepareRaspExecutionStateMapping = async (): Promise<void> => {
  const newValues = await getRaspExecutionStateIdentifiers();
  const threats = RaspExecutionState.getValues();
  threats.map((threat, index) => {
    threat.value = newValues[index]!;
  });
};
