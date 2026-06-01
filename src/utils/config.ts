import type {
  ReasonMode,
  ScanScope,
  SuspiciousAppDetectionConfig,
  TalsecAndroidConfig,
  TalsecConfig,
} from '../types/types';

const DEFAULT_SCAN_SCOPE: ScanScope = {
  scopeType: 'SIDELOADED_ONLY',
};

const DEFAULT_REASON_MODE: ReasonMode = 'HIGHEST_CONFIDENCE';

const withDetectionDefaults = (
  config: SuspiciousAppDetectionConfig
): SuspiciousAppDetectionConfig => ({
  ...config,
  scanScope: config.scanScope ?? DEFAULT_SCAN_SCOPE,
  reasonMode: config.reasonMode ?? DEFAULT_REASON_MODE,
});

export const normalizeAndroidConfig = (
  androidConfig: TalsecAndroidConfig
): TalsecAndroidConfig => {
  if (!androidConfig.suspiciousAppDetectionConfig) {
    return androidConfig;
  }
  return {
    ...androidConfig,
    suspiciousAppDetectionConfig: withDetectionDefaults(
      androidConfig.suspiciousAppDetectionConfig
    ),
  };
};

export const withDefaults = (options: TalsecConfig): TalsecConfig => ({
  ...options,
  androidConfig: options.androidConfig
    ? normalizeAndroidConfig(options.androidConfig)
    : undefined,
});
