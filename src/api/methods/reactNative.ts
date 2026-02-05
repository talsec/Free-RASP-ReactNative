import { talsecStart } from './native';
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

let isRaspStarted = false;

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

      if (isRaspStarted) {
        return;
      }

      try {
        const response = await talsecStart(config);
        if (response !== 'freeRASP started') {
          onInvalidCallback();
        }
        isRaspStarted = true;
      } catch (e: any) {
        console.error(`${e.code}: ${e.message}`);
      }
    })();

    return () => {
      (async () => {
        await removeThreatListener();
        await removeRaspExecutionStateEventListener();
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
