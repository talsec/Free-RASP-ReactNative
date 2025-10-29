package com.freeraspreactnative.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray

/**
 * Sealed class to represent the error codes.
 *
 * Sealed classes are used because of obfuscation - enums classes are not obfuscated well enough.
 *
 * @property value integer value of the error code.
 */
internal sealed class ThreatEvent(override val value: Int) : BaseRaspEvent {
  override val channelName: String get() = CHANNEL_NAME
  override val channelKey: String get() = CHANNEL_KEY

  data object AppIntegrity : ThreatEvent((10000..999999999).random())
  data object PrivilegedAccess : ThreatEvent((10000..999999999).random())
  data object Debug : ThreatEvent((10000..999999999).random())
  data object Hooks : ThreatEvent((10000..999999999).random())
  data object Passcode : ThreatEvent((10000..999999999).random())
  data object Simulator : ThreatEvent((10000..999999999).random())
  data object SecureHardwareNotAvailable : ThreatEvent((10000..999999999).random())
  data object DeviceBinding : ThreatEvent((10000..999999999).random())
  data object UnofficialStore : ThreatEvent((10000..999999999).random())
  data object ObfuscationIssues : ThreatEvent((10000..999999999).random())
  data object SystemVPN : ThreatEvent((10000..999999999).random())
  data object DevMode : ThreatEvent((10000..999999999).random())
  data object Malware : ThreatEvent((10000..999999999).random())
  data object ADBEnabled : ThreatEvent((10000..999999999).random())
  data object Screenshot : ThreatEvent((10000..999999999).random())
  data object ScreenRecording : ThreatEvent((10000..999999999).random())
  data object MultiInstance : ThreatEvent((10000..999999999).random())
  data object TimeSpoofing : ThreatEvent((10000..999999999).random())
  data object LocationSpoofing : ThreatEvent((10000..999999999).random())
  data object UnsecureWifi : ThreatEvent((10000..999999999).random())

  companion object Companion {
    internal val CHANNEL_NAME = (10000..999999999).random().toString()
    internal val CHANNEL_KEY = (10000..999999999).random().toString()
    internal val MALWARE_CHANNEL_KEY = (10000..999999999).random().toString()

    internal val ALL_EVENTS = Arguments.fromList(
      listOf(
        AppIntegrity,
        PrivilegedAccess,
        Debug,
        Hooks,
        Passcode,
        Simulator,
        SecureHardwareNotAvailable,
        SystemVPN,
        DeviceBinding,
        UnofficialStore,
        ObfuscationIssues,
        DevMode,
        Malware,
        ADBEnabled,
        Screenshot,
        ScreenRecording,
        MultiInstance,
        TimeSpoofing,
        LocationSpoofing,
        UnsecureWifi
      ).map { it.value })
  }
}
