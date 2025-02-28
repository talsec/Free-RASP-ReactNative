package com.freeraspreactnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray

/**
 * Sealed class to represent the error codes.
 *
 * Sealed classes are used because of obfuscation - enums classes are not obfuscated well enough.
 *
 * @property value integer value of the error code.
 */
internal sealed class Threat(val value: Int) {
  object AppIntegrity : Threat((10000..999999999).random())
  object PrivilegedAccess : Threat((10000..999999999).random())
  object Debug : Threat((10000..999999999).random())
  object Hooks : Threat((10000..999999999).random())
  object Passcode : Threat((10000..999999999).random())
  object Simulator : Threat((10000..999999999).random())
  object SecureHardwareNotAvailable : Threat((10000..999999999).random())
  object DeviceBinding : Threat((10000..999999999).random())
  object UnofficialStore : Threat((10000..999999999).random())
  object ObfuscationIssues : Threat((10000..999999999).random())
  object SystemVPN : Threat((10000..999999999).random())
  object DevMode : Threat((10000..999999999).random())
  object Malware : Threat((10000..999999999).random())
  object ADBEnabled : Threat((10000..999999999).random())
  object Screenshot : Threat((10000..999999999).random())
  object ScreenRecording : Threat((10000..999999999).random())

  companion object {
    internal fun getThreatValues(): WritableArray {
      return Arguments.fromList(
        listOf(
          AppIntegrity.value,
          PrivilegedAccess.value,
          Debug.value,
          Hooks.value,
          Passcode.value,
          Simulator.value,
          SecureHardwareNotAvailable.value,
          SystemVPN.value,
          DeviceBinding.value,
          UnofficialStore.value,
          ObfuscationIssues.value,
          DevMode.value,
          Malware.value,
          ADBEnabled.value,
          Screenshot.value,
          ScreenRecording.value
        )
      )
    }
  }
}
