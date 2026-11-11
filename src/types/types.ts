import type { TalsecError } from './errors';

export type TalsecConfig = {
  androidConfig?: TalsecAndroidConfig;
  iosConfig?: TalsecIosConfig;
  watcherMail: string;
  isProd?: boolean;
  killOnBypass?: boolean;
};

export type ScopeType =
  | 'SIDELOADED_ONLY'
  | 'SIDELOADED_AND_SYSTEM_EXCLUDE_OEM'
  | 'SIDELOADED_AND_OEM'
  | 'SIDELOADED_AND_SYSTEM_AND_OEM'
  | 'ALL';

export type ReasonMode = 'ALL' | 'HIGHEST_CONFIDENCE';

export type ScanScope = {
  scopeType: ScopeType;
  trustedInstallSources?: string[];
};

export type SuspiciousAppDetectionConfig = {
  packageNames?: string[];
  hashes?: string[];
  requestedPermissions?: string[][];
  grantedPermissions?: string[][];
  scanScope: ScanScope;
  reasonMode: ReasonMode;
};

export type TalsecAndroidConfig = {
  packageName: string;
  certificateHashes: string[];
  supportedAlternativeStores?: string[];
  suspiciousAppDetectionConfig?: SuspiciousAppDetectionConfig;
};

export type TalsecIosConfig = {
  appBundleIds: string[];
  appTeamId: string;
};

export type SuspiciousAppInfo = {
  packageInfo: PackageInfo;
  reasons: string[];
  permissions?: string[];
};

export type PackageInfo = {
  packageName: string;
  appName?: string;
  version?: string;
  appIcon?: string;
  installerStore?: string;
};

/**
 * State of an ongoing call reported by the ongoing call detection.
 *
 * - `STARTED` - a call started while the detection was running
 * - `ONGOING` - a call was already in progress when the detection started
 * - `STOPPED` - a previously reported call has ended
 */
export type CallState = 'STARTED' | 'ONGOING' | 'STOPPED';

export type ThreatEventActions = {
  privilegedAccess?: () => any;
  debug?: () => any;
  simulator?: () => any;
  appIntegrity?: () => any;
  unofficialStore?: () => any;
  hooks?: () => any;
  deviceBinding?: () => any;
  deviceID?: () => any;
  passcode?: () => any;
  secureHardwareNotAvailable?: () => any;
  obfuscationIssues?: () => any;
  devMode?: () => any;
  systemVPN?: () => any;
  malware?: (suspiciousApps: SuspiciousAppInfo[]) => any;
  adbEnabled?: () => any;
  screenshot?: () => any;
  screenRecording?: () => any;
  multiInstance?: () => any;
  timeSpoofing?: () => any;
  locationSpoofing?: () => any;
  unsecureWifi?: () => any;
  automation?: () => any;
  bootloader?: () => any;
  /**
   * Android only. Requires `startOngoingCallDetection()`.
   */
  ongoingCall?: (state: CallState) => any;
};

export type NativeEvent = {
  [key: string]: number | string | string[] | undefined;
};

export type RaspExecutionStateEventActions = {
  /**
   * The fast (standard) checks have been completed. On Android, the postponed
   * checks may still run afterwards. On iOS, triggered when all checks have
   * been completed.
   */
  fastChecksFinished?: () => any;
  /**
   * Android only. The critical checks have been completed, before the
   * non-critical checks.
   */
  criticalChecksFinished?: () => any;
  /**
   * Android only. The postponed checks have been completed, which ends the
   * initial evaluation.
   */
  postponedChecksFinished?: () => any;
};

/**
 * State returned by `useFreeRasp`.
 */
export type FreeRaspStatus = {
  /** `true` once freeRASP has been started. */
  started: boolean;
  /** Error that prevented the listeners from being registered or freeRASP from starting. */
  error: TalsecError | null;
};
