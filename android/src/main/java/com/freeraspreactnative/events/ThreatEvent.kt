package com.freeraspreactnative.events

import com.facebook.react.bridge.Arguments
import com.freeraspreactnative.utils.RandomGenerator.generateRandomIdentifiers

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

  data object AppIntegrity : ThreatEvent(identifiers[3])
  data object PrivilegedAccess : ThreatEvent(identifiers[4])
  data object Debug : ThreatEvent(identifiers[5])
  data object Hooks : ThreatEvent(identifiers[6])
  data object Passcode : ThreatEvent(identifiers[7])
  data object Simulator : ThreatEvent(identifiers[8])
  data object SecureHardwareNotAvailable : ThreatEvent(identifiers[9])
  data object DeviceBinding : ThreatEvent(identifiers[10])
  data object UnofficialStore : ThreatEvent(identifiers[11])
  data object ObfuscationIssues : ThreatEvent(identifiers[12])
  data object SystemVPN : ThreatEvent(identifiers[13])
  data object DevMode : ThreatEvent(identifiers[14])
  data object Malware : ThreatEvent(identifiers[15])
  data object ADBEnabled : ThreatEvent(identifiers[16])
  data object Screenshot : ThreatEvent(identifiers[17])
  data object ScreenRecording : ThreatEvent(identifiers[18])
  data object MultiInstance : ThreatEvent(identifiers[19])
  data object TimeSpoofing : ThreatEvent(identifiers[20])
  data object LocationSpoofing : ThreatEvent(identifiers[21])
  data object UnsecureWifi : ThreatEvent(identifiers[22])

  companion object {
    val identifiers = generateRandomIdentifiers(23)

    internal val CHANNEL_NAME = identifiers[0].toString()
    internal val CHANNEL_KEY = identifiers[1].toString()
    internal val MALWARE_CHANNEL_KEY = identifiers[2].toString()

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
