/**
 * Interface representing base build properties configuration.
 */
export interface PluginConfigType {
  /**
   * Interface representing available configuration for Android native build properties.
   * @platform android
   */
  android?: PluginConfigTypeAndroid;
  /**
   * Interface representing available configuration for iOS native build.
   * @platform ios
   */
  ios?: PluginConfigTypeIos;
}

/**
 * Interface representing available configuration for Android native build properties.
 * @platform android
 */
export interface PluginConfigTypeAndroid {
  /**
   * Override the default `minSdkVersion` version number in **build.gradle**.
   * */
  minSdkVersion?: number;
  R8Version?: string;
}

/**
 * Interface representing available configuration for iOS native build.
 * @platform ios
 *
 * TODO(SPM infra): experimental Swift Package Manager delivery of TalsecRuntime.
 * Not usable until the dedicated RN-flavour manifest repo + GCP-hosted xcframework
 * are ready. Defaults to off — the vendored xcframework is used.
 */
export interface PluginConfigTypeIos {
  /**
   * Opt in to the experimental SPM integration of TalsecRuntime. When enabled the
   * plugin sets dynamically linked frameworks and injects the TalsecRuntime embed
   * step into the generated Podfile's `post_install`.
   *
   * @default false
   */
  useSpm?: boolean;
}
