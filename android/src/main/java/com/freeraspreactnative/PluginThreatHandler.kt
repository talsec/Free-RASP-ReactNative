package com.freeraspreactnative

import android.content.Context
import app.talsec.rasp.security.api.SuspiciousAppInfo
import app.talsec.rasp.security.api.ThreatListener
import app.talsec.rasp.security.api.ThreatListener.CallState
import com.freeraspreactnative.dispatchers.ExecutionStateDispatcher
import com.freeraspreactnative.dispatchers.ThreatDispatcher
import com.freeraspreactnative.events.RaspExecutionStateEvent
import com.freeraspreactnative.events.ThreatEvent

internal object PluginThreatHandler {

  private val threatDetected = object : ThreatListener.ThreatDetected() {

    override fun onPrivilegedAccess() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.PrivilegedAccess)
    }

    override fun onDebug() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Debug)
    }

    override fun onSimulator() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Simulator)
    }

    override fun onAppIntegrity() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.AppIntegrity)
    }

    override fun onUnofficialStore() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.UnofficialStore)
    }

    override fun onHooks() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Hooks)
    }

    override fun onDeviceBinding() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.DeviceBinding)
    }

    override fun onObfuscationIssues() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.ObfuscationIssues)
    }

    override fun onMalware(packageInfo: List<SuspiciousAppInfo>) {
      ThreatDispatcher.dispatchMalware(packageInfo.toMutableList())
    }

    override fun onScreenshot() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Screenshot)
    }

    override fun onScreenRecording() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.ScreenRecording)
    }

    override fun onMultiInstance() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.MultiInstance)
    }

    override fun onUnsecureWifi() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.UnsecureWifi)
    }

    override fun onTimeSpoofing() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.TimeSpoofing)
    }

    override fun onLocationSpoofing() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.LocationSpoofing)
    }

    override fun onAutomation() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Automation)
    }

    override fun onBootloader() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Bootloader)
    }

    override fun onOngoingCall(state: CallState) {
      ThreatDispatcher.dispatchOngoingCall(state)
    }
  }

  private val deviceState = object : ThreatListener.DeviceState() {

    override fun onPasscode() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.Passcode)
    }

    override fun onSecureHardwareNotAvailable() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.SecureHardwareNotAvailable)
    }

    override fun onDevMode() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.DevMode)
    }

    override fun onAdbEnabled() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.ADBEnabled)
    }

    override fun onSystemVpn() {
      ThreatDispatcher.dispatchThreat(ThreatEvent.SystemVPN)
    }
  }

  private val raspExecutionState = object : ThreatListener.RaspExecutionState() {
    override fun onCriticalChecksFinished() {
      ExecutionStateDispatcher.dispatch(RaspExecutionStateEvent.CriticalChecksFinished)
    }

    override fun onFastChecksFinished() {
      ExecutionStateDispatcher.dispatch(RaspExecutionStateEvent.FastChecksFinished)
    }

    override fun onPostponedChecksFinished() {
      ExecutionStateDispatcher.dispatch(RaspExecutionStateEvent.PostponedChecksFinished)
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
