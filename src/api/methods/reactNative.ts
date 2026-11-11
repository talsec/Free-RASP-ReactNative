import { talsecStart } from './native';
import { useEffect, useState } from 'react';
import {
  setRaspExecutionStateListener,
  removeRaspExecutionStateEventListener,
} from '../listeners/raspExecutionState';
import { setThreatListeners, removeThreatListener } from '../listeners/threat';
import type {
  ThreatEventActions,
  TalsecConfig,
  RaspExecutionStateEventActions,
  FreeRaspStatus,
} from '../../types/types';
import { TalsecError } from '../../types/errors';

let isRaspStarted = false;

const toTalsecError = (e: unknown): TalsecError =>
  e instanceof TalsecError
    ? e
    : new TalsecError(
        'talsec-failure',
        e instanceof Error ? e.message : String(e)
      );

/**
 * Registers the threat and RASP execution state listeners and starts freeRASP.
 *
 * freeRASP is started only once per app run; later mounts only re-register
 * the listeners.
 *
 * @returns `started` once freeRASP runs, or the `TalsecError` that prevented
 * the listeners from being registered or freeRASP from starting.
 */
export const useFreeRasp = (
  config: TalsecConfig,
  actions: ThreatEventActions,
  raspExecutionStateActions?: RaspExecutionStateEventActions
): FreeRaspStatus => {
  const [status, setStatus] = useState<FreeRaspStatus>({
    started: isRaspStarted,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        await setThreatListeners(actions);
        if (raspExecutionStateActions) {
          await setRaspExecutionStateListener(raspExecutionStateActions);
        }

        if (!isRaspStarted) {
          await talsecStart(config);
          isRaspStarted = true;
        }

        if (isMounted) {
          setStatus({ started: true, error: null });
        }
      } catch (e) {
        if (isMounted) {
          setStatus({ started: isRaspStarted, error: toTalsecError(e) });
        }
      }
    })();

    return () => {
      isMounted = false;
      (async () => {
        await removeThreatListener();
        await removeRaspExecutionStateEventListener();
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return status;
};
