package com.freeraspreactnative.events

import com.facebook.react.bridge.Arguments
import com.freeraspreactnative.utils.RandomGenerator

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

  data object AppIntegrity : ThreatEvent(RandomGenerator.next())
  data object PrivilegedAccess : ThreatEvent(RandomGenerator.next())
  data object Debug : ThreatEvent(RandomGenerator.next())
  data object Hooks : ThreatEvent(RandomGenerator.next())
  data object Passcode : ThreatEvent(RandomGenerator.next())
  data object Simulator : ThreatEvent(RandomGenerator.next())
  data object SecureHardwareNotAvailable : ThreatEvent(RandomGenerator.next())
  data object DeviceBinding : ThreatEvent(RandomGenerator.next())
  data object UnofficialStore : ThreatEvent(RandomGenerator.next())
  data object ObfuscationIssues : ThreatEvent(RandomGenerator.next())
  data object SystemVPN : ThreatEvent(RandomGenerator.next())
  data object DevMode : ThreatEvent(RandomGenerator.next())
  data object Malware : ThreatEvent(RandomGenerator.next())
  data object ADBEnabled : ThreatEvent(RandomGenerator.next())
  data object Screenshot : ThreatEvent(RandomGenerator.next())
  data object ScreenRecording : ThreatEvent(RandomGenerator.next())
  data object MultiInstance : ThreatEvent(RandomGenerator.next())
  data object TimeSpoofing : ThreatEvent(RandomGenerator.next())
  data object LocationSpoofing : ThreatEvent(RandomGenerator.next())
  data object UnsecureWifi : ThreatEvent(RandomGenerator.next())

  companion object {
    internal val CHANNEL_NAME = RandomGenerator.next().toString()
    internal val CHANNEL_KEY = RandomGenerator.next().toString()
    internal val MALWARE_CHANNEL_KEY = RandomGenerator.next().toString()

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
