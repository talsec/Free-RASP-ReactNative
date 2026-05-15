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

export type MalwareScanScope = {
  scanScope: ScopeType;
  trustedInstallSources?: string[];
};

export type SuspiciousAppDetectionConfig = {
  packageNames?: string[];
  hashes?: string[];
  requestedPermissions?: string[][];
  grantedPermissions?: string[][];
  malwareScanScope: MalwareScanScope;
  reasonMode: ReasonMode;
};

export type TalsecAndroidConfig = {
  packageName: string;
  certificateHashes: string[];
  supportedAlternativeStores?: string[];
  malwareConfig?: TalsecMalwareConfig;
  suspiciousAppDetectionConfig?: SuspiciousAppDetectionConfig;
};

export type TalsecIosConfig = {
  appBundleId: string;
  appTeamId: string;
};

export type TalsecMalwareConfig = {
  /** @deprecated Use SuspiciousAppDetectionConfig instead */
  blacklistedHashes?: string[];
  /** @deprecated Use SuspiciousAppDetectionConfig instead */
  blacklistedPackageNames?: string[];
  /** @deprecated Use SuspiciousAppDetectionConfig instead */
  suspiciousPermissions?: string[][];
  /** @deprecated Use SuspiciousAppDetectionConfig instead */
  whitelistedInstallationSources?: string[];
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
};

export type NativeEvent = { [key: string]: number | string[] | undefined };

export type RaspExecutionStateEventActions = {
  allChecksFinished?: () => any;
};
