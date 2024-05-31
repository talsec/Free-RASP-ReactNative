package com.freeraspreactnative

import com.aheaditec.talsec_security.security.api.ThreatListener

internal object FreeraspThreatHandler : ThreatListener.ThreatDetected, ThreatListener.DeviceState {

  internal var listener: TalsecReactNative? = null

  override fun onRootDetected() {
    listener?.threatDetected(Threat.PrivilegedAccess)
  }

  override fun onDebuggerDetected() {
    listener?.threatDetected(Threat.Debug)
  }

  override fun onEmulatorDetected() {
    listener?.threatDetected(Threat.Simulator)
  }

  override fun onTamperDetected() {
    listener?.threatDetected(Threat.AppIntegrity)
  }

  override fun onUntrustedInstallationSourceDetected() {
    listener?.threatDetected(Threat.UnofficialStore)
  }

  override fun onHookDetected() {
    listener?.threatDetected(Threat.Hooks)
  }

  override fun onDeviceBindingDetected() {
    listener?.threatDetected(Threat.DeviceBinding)
  }

  override fun onObfuscationIssuesDetected() {
    listener?.threatDetected(Threat.ObfuscationIssues)
  }

  override fun onUnlockedDeviceDetected() {
    listener?.threatDetected(Threat.Passcode)
  }

  override fun onHardwareBackedKeystoreNotAvailableDetected() {
    listener?.threatDetected(Threat.SecureHardwareNotAvailable)
  }

  override fun onDeveloperModeDetected() {
    listener?.threatDetected(Threat.DevMode)
  }

  override fun onSystemVPNDetected() {
    listener?.threatDetected(Threat.SystemVPN)
  }

  internal interface TalsecReactNative {
    fun threatDetected(threatType: Threat)
  }
}
