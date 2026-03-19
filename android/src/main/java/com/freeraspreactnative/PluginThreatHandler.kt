package com.freeraspreactnative

import android.content.Context
import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.aheaditec.talsec_security.security.api.ThreatListener
import com.freeraspreactnative.dispatchers.ExecutionStateDispatcher
import com.freeraspreactnative.dispatchers.ThreatDispatcher
import com.freeraspreactnative.events.RaspExecutionStateEvent
import com.freeraspreactnative.events.ThreatEvent

internal object PluginThreatHandler {

  fun initializePluginListener(listener: FreeraspReactNativeModule.PluginListener) {
    ThreatDispatcher.listener = listener
    ExecutionStateDispatcher.listener = listener
  }

  private val threatDetected = object : ThreatListener.ThreatDetected() {

    override fun onRootDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.PrivilegedAccess)
    }

    override fun onDebuggerDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Debug)
    }

    override fun onEmulatorDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Simulator)
    }

    override fun onTamperDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.AppIntegrity)
    }

    override fun onUntrustedInstallationSourceDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.UnofficialStore)
    }

    override fun onHookDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Hooks)
    }

    override fun onDeviceBindingDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.DeviceBinding)
    }

    override fun onObfuscationIssuesDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.ObfuscationIssues)
    }

    override fun onMalwareDetected(suspiciousAppInfos: MutableList<SuspiciousAppInfo>) {
      ThreatDispatcher.dispatchMalware(suspiciousAppInfos ?: mutableListOf())
    }

    override fun onScreenshotDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Screenshot)
    }

    override fun onScreenRecordingDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.ScreenRecording)
    }

    override fun onMultiInstanceDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.MultiInstance)
    }

    override fun onUnsecureWifiDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.UnsecureWifi)
    }

    override fun onTimeSpoofingDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.TimeSpoofing)
    }

    override fun onLocationSpoofingDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.LocationSpoofing)
    }

    override fun onAutomationDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Automation)
    }
  }

  private val deviceState = object : ThreatListener.DeviceState() {

    override fun onUnlockedDeviceDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Passcode)
    }

    override fun onHardwareBackedKeystoreNotAvailableDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.SecureHardwareNotAvailable)
    }

    override fun onDeveloperModeDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.DevMode)
    }

    override fun onADBEnabledDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.ADBEnabled)
    }

    override fun onSystemVPNDetected() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.SystemVPN)
    }
  }

  private val raspExecutionState = object : ThreatListener.RaspExecutionState() {
    override fun onAllChecksFinished() {
      ExecutionStateDispatcher.dispatch(RaspExecutionStateEvent.AllChecksFinished)
    }
  }

  private val internalListener = ThreatListener(threatDetected, deviceState, raspExecutionState)

  internal fun registerSDKListener(context: Context) {
    internalListener.registerListener(context)
  }

  internal fun unregisterSDKListener(context: Context) {
    internalListener.unregisterListener(context)
  }
}
