import { talsecStart } from 'freerasp-react-native';
import { useEffect } from 'react';
import {
  setRaspExecutionStateListener,
  removeRaspExecutionStateEventListener,
} from '../listeners/raspExecutionState';
import { setThreatListeners, removeThreatListener } from '../listeners/threat';
import type {
  ThreatEventActions,
  TalsecConfig,
  RaspExecutionStateEventActions,
} from '../../types/types';
import { onInvalidCallback } from './native';

export const useFreeRasp = (
  config: TalsecConfig,
  actions: ThreatEventActions,
  raspExecutionStateActions?: RaspExecutionStateEventActions
) => {
  useEffect(() => {
    (async () => {
      await setThreatListeners(actions);
      raspExecutionStateActions &&
        (await setRaspExecutionStateListener(raspExecutionStateActions));
      try {
        let response = await talsecStart(config);
        if (response !== 'freeRASP started') {
          onInvalidCallback();
        }
        console.log(response);
      } catch (e: any) {
        console.error(`${e.code}: ${e.message}`);
      }

      return () => {
        removeThreatListener();
        removeRaspExecutionStateEventListener();
      };
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
