import { useEffect } from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {
  Threat,
  type NativeEventEmitterActions,
  TalsecConfig,
} from './definitions';
import { getThreatCount, itemsHaveType } from './utils';

const { FreeraspReactNative } = NativeModules;

const eventEmitter = new NativeEventEmitter(FreeraspReactNative);
let eventsListener: EmitterSubscription;

const onInvalidCallback = (): void => {
  FreeraspReactNative.onInvalidCallback();
};

const getThreatIdentifiers = async (): Promise<number[]> => {
  let identifiers = await FreeraspReactNative.getThreatIdentifiers();
  if (
    identifiers.length !== getThreatCount() ||
    !itemsHaveType(identifiers, 'number')
  ) {
    onInvalidCallback();
  }
  return identifiers;
};

const getThreatChannelData = async (): Promise<[string, string]> => {
  let data = await FreeraspReactNative.getThreatChannelData();
  if (data.length !== 2 || !itemsHaveType(data, 'string')) {
    onInvalidCallback();
  }
  return data;
};

const prepareMapping = async (): Promise<void> => {
  const newValues = await getThreatIdentifiers();
  const threats = Threat.getValues();

  threats.map((threat, index) => {
    threat.value = newValues[index]!;
  });
};

export const setThreatListeners = async <T extends NativeEventEmitterActions>(
  config: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>
) => {
  const [channel, key] = await getThreatChannelData();
  await prepareMapping();

  eventsListener = eventEmitter.addListener(channel, (event) => {
    if (event[key] === undefined) {
      onInvalidCallback();
    }
    switch (event[key]) {
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
      default:
        onInvalidCallback();
        break;
    }
  });
};

export const removeThreatListeners = (): void => {
  eventsListener.remove();
};

export const talsecStart = async (options: TalsecConfig): Promise<string> => {
  return FreeraspReactNative.talsecStart(options);
};

export const useFreeRasp = <T extends NativeEventEmitterActions>(
  config: TalsecConfig,
  actions: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>
) => {
  useEffect(() => {
    (async () => {
      await setThreatListeners(actions);
      let response = await talsecStart(config);
      if (response !== 'freeRASP started') {
        onInvalidCallback();
      }
      console.log(response);

      return () => {
        removeThreatListeners();
      };
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default FreeraspReactNative;
