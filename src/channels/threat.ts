import { Platform } from 'react-native';
import { getThreatCount, itemsHaveType } from '../utils/utils';
import { FreeraspReactNative } from '../api/nativeModules';
import { Threat } from '../models/threat';
import { onInvalidCallback } from '../api/methods/native';

export const getThreatIdentifiers = async (): Promise<number[]> => {
  const identifiers = await FreeraspReactNative.getThreatIdentifiers();
  if (
    identifiers.length !== getThreatCount() ||
    !itemsHaveType(identifiers, 'number')
  ) {
    onInvalidCallback();
  }
  return identifiers;
};

export const getThreatChannelData = async (): Promise<
  [string, string, string, string?]
> => {
  // Android also sends the key of the ongoing call state
  const dataLength = Platform.OS === 'android' ? 4 : 3;
  const data = await FreeraspReactNative.getThreatChannelData();
  if (data.length !== dataLength || !itemsHaveType(data, 'string')) {
    onInvalidCallback();
  }
  return data;
};

export const prepareThreatMapping = async (): Promise<void> => {
  const newValues = await getThreatIdentifiers();
  const threats = Threat.getValues();
  threats.map((threat, index) => {
    threat.value = newValues[index]!;
  });
};
