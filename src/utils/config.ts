import type {
  ReasonMode,
  ScanScope,
  SuspiciousAppDetectionConfig,
  TalsecAndroidConfig,
  TalsecConfig,
} from '../types/types';

const DEFAULT_SCAN_SCOPE: ScanScope = {
  scanScope: 'SIDELOADED_ONLY',
};

const DEFAULT_REASON_MODE: ReasonMode = 'HIGHEST_CONFIDENCE';

export const withDefaults = (
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
    suspiciousAppDetectionConfig: withDefaults(
      androidConfig.suspiciousAppDetectionConfig
    ),
  };
};

export const normalizeConfig = (options: TalsecConfig): TalsecConfig => ({
  ...options,
  androidConfig: options.androidConfig
    ? normalizeAndroidConfig(options.androidConfig)
    : undefined,
});
