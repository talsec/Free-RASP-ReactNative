package com.freeraspreactnative

import com.aheaditec.talsec_security.security.api.Talsec
import com.aheaditec.talsec_security.security.api.TalsecConfig
import com.aheaditec.talsec_security.security.api.ThreatListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil.runOnUiThread
import com.facebook.react.bridge.WritableArray
import com.facebook.react.modules.core.DeviceEventManagerModule

class FreeraspReactNativeModule(val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val listener = ThreatListener(FreeraspThreatHandler, FreeraspThreatHandler)

  override fun getName(): String {
    return NAME
  }

  init {
    appReactContext = reactContext
  }

  @ReactMethod
  fun talsecStart(
    options: ReadableMap,
    promise: Promise
  ) {

    try {
      val config = buildTalsecConfig(options)
      FreeraspThreatHandler.listener = ThreatListener
      listener.registerListener(reactContext)
      runOnUiThread {
        Talsec.start(reactContext, config)
      }

      promise.resolve("freeRASP started")

    }
    catch (e: Exception) {
      promise.reject("TalsecInitializationError", e.message, e)
    }
  }

  /**
   * Method to get the random identifiers of callbacks
   */
  @ReactMethod
  fun getThreatIdentifiers(promise: Promise) {
    promise.resolve(Threat.getThreatValues())
  }

  /**
   * Method to setup the message passing between native and React Native
   * @return list of [THREAT_CHANNEL_NAME, THREAT_CHANNEL_KEY]
   */
  @ReactMethod
  fun getThreatChannelData(promise: Promise) {
    val channelData: WritableArray = Arguments.createArray()
    channelData.pushString(THREAT_CHANNEL_NAME)
    channelData.pushString(THREAT_CHANNEL_KEY)
    promise.resolve(channelData)
  }

  /**
   * We never send an invalid callback over our channel.
   * Therefore, if this happens, we want to kill the app.
   */
  @ReactMethod
  fun onInvalidCallback() {
    android.os.Process.killProcess(android.os.Process.myPid())
  }

  @ReactMethod
  fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
    // Set up any upstream listeners or background tasks as necessary
  }

  @ReactMethod
  fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int) {
    // Remove upstream listeners, stop unnecessary background tasks
  }

  private fun buildTalsecConfig(config: ReadableMap): TalsecConfig {
    val androidConfig = config.getMapThrowing("androidConfig")
    val packageName = androidConfig.getStringThrowing("packageName")
    val certificateHashes = androidConfig.getArraySafe("certificateHashes")

    val talsecBuilder = TalsecConfig.Builder(packageName, certificateHashes)
      .watcherMail(config.getString("watcherMail"))
      .supportedAlternativeStores(androidConfig.getArraySafe("supportedAlternativeStores"))
      .prod(config.getBooleanSafe("isProd"))

    return talsecBuilder.build()
  }

  companion object {
    const val NAME = "FreeraspReactNative"
    val THREAT_CHANNEL_NAME = (10000..999999999).random()
      .toString() // name of the channel over which threat callbacks are sent
    val THREAT_CHANNEL_KEY = (10000..999999999).random()
      .toString() // key of the argument map under which threats are expected
    private lateinit var appReactContext: ReactApplicationContext
    private fun notifyListeners(threat: Threat) {
      val params = Arguments.createMap()
      params.putInt(THREAT_CHANNEL_KEY, threat.value)
      appReactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(THREAT_CHANNEL_NAME, params)
    }
  }

  internal object ThreatListener : FreeraspThreatHandler.TalsecReactNative {
    override fun threatDetected(threatType: Threat) {
      notifyListeners(threatType)
    }
  }
}
