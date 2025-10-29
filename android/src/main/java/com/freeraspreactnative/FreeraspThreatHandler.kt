package com.freeraspreactnative

import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.aheaditec.talsec_security.security.api.ThreatListener
import com.freeraspreactnative.events.RaspExecutionStateEvent
import com.freeraspreactnative.events.ThreatEvent

internal object FreeraspThreatHandler : ThreatListener.ThreatDetected, ThreatListener.DeviceState, ThreatListener.RaspExecutionState() {

  internal var listener: TalsecReactNative? = null

  override fun onRootDetected() {
    listener?.threatDetected(ThreatEvent.PrivilegedAccess)
  }

  override fun onDebuggerDetected() {
    listener?.threatDetected(ThreatEvent.Debug)
  }

  override fun onEmulatorDetected() {
    listener?.threatDetected(ThreatEvent.Simulator)
  }

  override fun onTamperDetected() {
    listener?.threatDetected(ThreatEvent.AppIntegrity)
  }

  override fun onUntrustedInstallationSourceDetected() {
    listener?.threatDetected(ThreatEvent.UnofficialStore)
  }

  override fun onHookDetected() {
    listener?.threatDetected(ThreatEvent.Hooks)
  }

  override fun onDeviceBindingDetected() {
    listener?.threatDetected(ThreatEvent.DeviceBinding)
  }

  override fun onObfuscationIssuesDetected() {
    listener?.threatDetected(ThreatEvent.ObfuscationIssues)
  }

  override fun onMalwareDetected(suspiciousAppInfos: MutableList<SuspiciousAppInfo>) {
    listener?.malwareDetected(suspiciousAppInfos ?: mutableListOf())
  }

  override fun onUnlockedDeviceDetected() {
    listener?.threatDetected(ThreatEvent.Passcode)
  }

  override fun onHardwareBackedKeystoreNotAvailableDetected() {
    listener?.threatDetected(ThreatEvent.SecureHardwareNotAvailable)
  }

  override fun onDeveloperModeDetected() {
    listener?.threatDetected(ThreatEvent.DevMode)
  }

  override fun onADBEnabledDetected() {
    listener?.threatDetected(ThreatEvent.ADBEnabled)
  }

  override fun onSystemVPNDetected() {
    listener?.threatDetected(ThreatEvent.SystemVPN)
  }

  override fun onScreenshotDetected() {
    listener?.threatDetected(ThreatEvent.Screenshot)
  }

  override fun onScreenRecordingDetected() {
    listener?.threatDetected(ThreatEvent.ScreenRecording)
  }

  override fun onMultiInstanceDetected() {
    listener?.threatDetected(ThreatEvent.MultiInstance)
  }

  override fun onUnsecureWifiDetected() {
    listener?.threatDetected(ThreatEvent.UnsecureWifi)
  }

  override fun onTimeSpoofingDetected() {
    listener?.threatDetected(ThreatEvent.TimeSpoofing)
  }

  override fun onLocationSpoofingDetected() {
    listener?.threatDetected(ThreatEvent.LocationSpoofing)
  }

  override fun onAllChecksFinished() {
    listener?.raspExecutionStateChanged(RaspExecutionStateEvent.AllChecksFinished)
  }

  internal interface TalsecReactNative {
    fun threatDetected(threatEventType: ThreatEvent)

    fun malwareDetected(suspiciousApps: MutableList<SuspiciousAppInfo>)

    fun raspExecutionStateChanged(event: RaspExecutionStateEvent)
  }
}
