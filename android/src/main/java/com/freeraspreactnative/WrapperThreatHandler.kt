package com.freeraspreactnative

import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.aheaditec.talsec_security.security.api.ThreatListener
import com.freeraspreactnative.dispatchers.ExecutionStateDispatcher
import com.freeraspreactnative.dispatchers.ThreatDispatcher
import com.freeraspreactnative.events.RaspExecutionStateEvent
import com.freeraspreactnative.events.ThreatEvent

internal object WrapperThreatHandler {

  internal val threatDispatcher = ThreatDispatcher()
  internal val executionStateDispatcher = ExecutionStateDispatcher()

  internal val threatDetected = object : ThreatListener.ThreatDetected() {

    override fun onRootDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.PrivilegedAccess)
    }

    override fun onDebuggerDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.Debug)
    }

    override fun onEmulatorDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.Simulator)
    }

    override fun onTamperDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.AppIntegrity)
    }

    override fun onUntrustedInstallationSourceDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.UnofficialStore)
    }

    override fun onHookDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.Hooks)
    }

    override fun onDeviceBindingDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.DeviceBinding)
    }

    override fun onObfuscationIssuesDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.ObfuscationIssues)
    }

    override fun onMalwareDetected(suspiciousAppInfos: MutableList<SuspiciousAppInfo>) {
      threatDispatcher.dispatchMalware(suspiciousAppInfos ?: mutableListOf())
    }

    override fun onScreenshotDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.Screenshot)
    }

    override fun onScreenRecordingDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.ScreenRecording)
    }

    override fun onMultiInstanceDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.MultiInstance)
    }

    override fun onUnsecureWifiDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.UnsecureWifi)
    }

    override fun onTimeSpoofingDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.TimeSpoofing)
    }

    override fun onLocationSpoofingDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.LocationSpoofing)
    }

    override fun onAutomationDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.Automation)
    }
  }

  internal val deviceState = object : ThreatListener.DeviceState() {

    override fun onUnlockedDeviceDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.Passcode)
    }

    override fun onHardwareBackedKeystoreNotAvailableDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.SecureHardwareNotAvailable)
    }

    override fun onDeveloperModeDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.DevMode)
    }

    override fun onADBEnabledDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.ADBEnabled)
    }

    override fun onSystemVPNDetected() {
      threatDispatcher.dispatchThreat(ThreatEvent.SystemVPN)
    }
  }

  internal val raspExecutionState = object : ThreatListener.RaspExecutionState() {
    override fun onAllChecksFinished() {
      executionStateDispatcher.dispatch(RaspExecutionStateEvent.AllChecksFinished)
    }
  }
}
