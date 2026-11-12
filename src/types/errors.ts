/**
 * Stable error codes shared with the other freeRASP plugins.
 *
 * - `talsec-failure` - a native call failed
 * - `unsupported-platform` - the feature is not available on this platform
 * - `configuration-exception` - the configuration is invalid
 * - `external-id-failure` - storing or removing the external ID failed
 * - `malware-failure` - a malware-detection call failed
 */
export type TalsecErrorCode =
  | 'talsec-failure'
  | 'unsupported-platform'
  | 'configuration-exception'
  | 'external-id-failure'
  | 'malware-failure';

/**
 * The only error freeRASP methods reject with.
 */
export class TalsecError extends Error {
  readonly code: TalsecErrorCode;

  constructor(code: TalsecErrorCode, message?: string) {
    super(message);
    this.name = 'TalsecError';
    this.code = code;
    Object.setPrototypeOf(this, TalsecError.prototype);
  }
}

/**
 * Runs a native call and rethrows any failure as a {@link TalsecError}.
 */
export const wrapNative = async <T>(
  code: TalsecErrorCode,
  fn: () => Promise<T>
): Promise<T> => {
  try {
    return await fn();
  } catch (e: any) {
    if (e instanceof TalsecError) {
      throw e;
    }
    throw new TalsecError(code, e?.message ?? String(e));
  }
};

/**
 * Rejects with an `unsupported-platform` error for Android-only features.
 */
export const androidOnly = (feature: string): Promise<never> =>
  Promise.reject(
    new TalsecError(
      'unsupported-platform',
      `${feature} is not available on iOS`
    )
  );
