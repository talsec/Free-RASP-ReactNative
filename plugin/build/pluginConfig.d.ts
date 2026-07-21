/**
 * Interface representing base build properties configuration.
 */
export interface PluginConfigType {
    ios?: PluginConfigTypeIos;
    /**
     * Interface representing available configuration for Android native build properties.
     * @platform android
     */
    android?: PluginConfigTypeAndroid;
}
/** @platform ios */
export interface PluginConfigTypeIos {
    /**
     * Use Swift Package Manager to deliver TalsecRuntime. Defaults to `true`.
     */
    useSpm?: boolean;
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
