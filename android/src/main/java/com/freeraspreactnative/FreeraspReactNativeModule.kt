package com.freeraspreactnative

import com.aheaditec.talsec_security.security.api.Talsec
import com.aheaditec.talsec_security.security.api.TalsecConfig
import com.aheaditec.talsec_security.security.api.ThreatListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class FreeraspReactNativeModule(val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), ThreatListener.ThreatDetected {

  private val listener = ThreatListener(this)

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun talsecStart(
    options: ReadableMap
  ) {

    try {
      val config = parseTalsecConfig(options)
      listener.registerListener(reactContext)
      ThreatListener( this,deviceStateListener).registerListener(reactContext)
      Talsec.start(reactContext, config)
      sendOngoingPluginResult("started", null)

    } catch (e: Exception) {
      val params = Arguments.createMap().apply {
        putString("message", e.message)
      }
      sendOngoingPluginResult("initializationError", params)
    }
  }

  @ReactMethod
  fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
    // Set up any upstream listeners or background tasks as necessary
  }

  @ReactMethod
  fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int) {
    // Remove upstream listeners, stop unnecessary background tasks
  }

  override fun onRootDetected() {
    sendOngoingPluginResult("privilegedAccess", null)
  }

  override fun onDebuggerDetected() {
    sendOngoingPluginResult("debug", null)
  }

  override fun onEmulatorDetected() {
    sendOngoingPluginResult("simulator", null)
  }

  override fun onTamperDetected() {
    sendOngoingPluginResult("appIntegrity", null)
  }

  override fun onUntrustedInstallationSourceDetected() {
    sendOngoingPluginResult("unofficialStore", null)
  }

  override fun onHookDetected() {
    sendOngoingPluginResult("hooks", null)
  }

  override fun onDeviceBindingDetected() {
    sendOngoingPluginResult("device binding", null)
  }

  private fun sendOngoingPluginResult(eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

    // This is optional. Use only if you are interested in device state information like device lock and HW backed keystore state
    private val deviceStateListener = object : ThreatListener.DeviceState {
        override fun onUnlockedDeviceDetected() {
          sendOngoingPluginResult("onUnlockedDeviceDetected", null)
        }

        override fun onHardwareBackedKeystoreNotAvailableDetected() {
            // Set your reaction
            sendOngoingPluginResult("onHardwareBackedKeystoreNotAvailableDetected", null)
        }
    }

  private fun parseTalsecConfig(config: ReadableMap): TalsecConfig {
    val androidConfig = config.getMap("androidConfig")!!
    val packageName = androidConfig.getString("packageName")!!
    val certificateHashes = mutableListOf<String>()
    val hashes = androidConfig.getArray("certificateHashes")!!
    for (i in 0 until hashes.size()) {
      certificateHashes.add(hashes.getString(i))
    }
    val watcherMail = config.getString("watcherMail")
    val alternativeStores = mutableListOf<String>()
    if (androidConfig.hasKey("supportedAlternativeStores")) {
      val stores = androidConfig.getArray("supportedAlternativeStores")!!
      for (i in 0 until stores.size()) {
        alternativeStores.add(stores.getString(i))
      }
    }
    return TalsecConfig(packageName, certificateHashes.toTypedArray(), watcherMail, alternativeStores.toTypedArray())
  }

  companion object {
    const val NAME = "FreeraspReactNative"
  }
}
