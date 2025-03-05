package com.freeraspreactnative

import android.os.Build
import android.os.Handler
import android.os.HandlerThread
import android.os.Looper
import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.aheaditec.talsec_security.security.api.Talsec
import com.aheaditec.talsec_security.security.api.TalsecConfig
import com.aheaditec.talsec_security.security.api.ThreatListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil.runOnUiThread
import com.facebook.react.bridge.WritableArray
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.freeraspreactnative.utils.Utils
import com.freeraspreactnative.utils.getArraySafe
import com.freeraspreactnative.utils.getBooleanSafe
import com.freeraspreactnative.utils.getMapThrowing
import com.freeraspreactnative.utils.getNestedArraySafe
import com.freeraspreactnative.utils.getStringThrowing
import com.freeraspreactnative.utils.toEncodedWritableArray

class FreeraspReactNativeModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val listener = ThreatListener(FreeraspThreatHandler, FreeraspThreatHandler)
  private val lifecycleListener = object : LifecycleEventListener {
    override fun onHostResume() {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
        currentActivity?.let { ScreenProtector.register(it) }
      }
    }

    override fun onHostPause() {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
        currentActivity?.let { ScreenProtector.unregister(it) }
      }
    }

    override fun onHostDestroy() {
      backgroundHandlerThread.quitSafely()
    }
  }

  override fun getName(): String {
    return NAME
  }

  init {
    appReactContext = reactContext
    reactContext.addLifecycleEventListener(lifecycleListener)
  }

  @ReactMethod
  fun talsecStart(
    options: ReadableMap, promise: Promise
  ) {

    try {
      val config = buildTalsecConfig(options)
      FreeraspThreatHandler.listener = ThreatListener
      listener.registerListener(reactContext)
      runOnUiThread {
        Talsec.start(reactContext, config)
        mainHandler.post {
          talsecStarted = true
          // This code must be called only AFTER Talsec.start
          currentActivity?.let { activity ->
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
              ScreenProtector.register(activity)
            }
          }
          promise.resolve("freeRASP started")
        }
      }

    } catch (e: Exception) {
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
    channelData.pushString(MALWARE_CHANNEL_KEY)
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

  /**
   * Method to add apps to Malware whitelist, so they don't get flagged as malware
   */
  @ReactMethod
  fun addToWhitelist(packageName: String, promise: Promise) {
    Talsec.addToWhitelist(reactContext, packageName)
    promise.resolve(true)
  }

  /**
   * Method retrieves app icon for the given parameter
   * @param packageName package name of the app we want to retrieve icon for
   * @return PNG with app icon encoded as a base64 string
   */
  @ReactMethod
  fun getAppIcon(packageName: String, promise: Promise) {
    // Perform the app icon encoding on a background thread
    backgroundHandler.post {
      val encodedData = Utils.getAppIconAsBase64String(reactContext, packageName)
      mainHandler.post { promise.resolve(encodedData) }
    }
  }

  /**
   * Method Block/Unblock screen capture
   * @param enable boolean for whether want to block or unblock the screen capture
   */
  @ReactMethod
  fun blockScreenCapture(enable: Boolean, promise: Promise) {
    val activity = currentActivity ?: run {
      promise.reject(
        "NativePluginError", "Cannot block screen capture, activity is null."
      )
      return
    }

    runOnUiThread {
      try {
        Talsec.blockScreenCapture(activity, enable)
        promise.resolve("Screen capture is now ${if (enable) "Blocked" else "Enabled"}.")
      } catch (e: Exception) {
        promise.reject("NativePluginError", "Error in blockScreenCapture: ${e.message}")
      }
    }
  }

  /**
   * Method Returns whether screen capture is blocked or not
   * @return boolean for is screem capture blocked or not
   */
  @ReactMethod
  fun isScreenCaptureBlocked(promise: Promise) {
    try {
      val isBlocked = Talsec.isScreenCaptureBlocked()
      promise.resolve(isBlocked)
    } catch (e: Exception) {
      promise.reject("NativePluginError", "Error in isScreenCaptureBlocked: ${e.message}")
    }
  }

  private fun buildTalsecConfig(config: ReadableMap): TalsecConfig {
    val androidConfig = config.getMapThrowing("androidConfig")
    val packageName = androidConfig.getStringThrowing("packageName")
    val certificateHashes = androidConfig.getArraySafe("certificateHashes")

    val talsecBuilder = TalsecConfig.Builder(packageName, certificateHashes)
      .watcherMail(config.getString("watcherMail"))
      .supportedAlternativeStores(androidConfig.getArraySafe("supportedAlternativeStores"))
      .prod(config.getBooleanSafe("isProd"))

    if (androidConfig.hasKey("malwareConfig")) {
      val malwareConfig = androidConfig.getMapThrowing("malwareConfig")
      talsecBuilder.whitelistedInstallationSources(malwareConfig.getArraySafe("whitelistedInstallationSources"))
      talsecBuilder.blacklistedHashes(malwareConfig.getArraySafe("blacklistedHashes"))
      talsecBuilder.blacklistedPackageNames(malwareConfig.getArraySafe("blacklistedPackageNames"))
      talsecBuilder.suspiciousPermissions(malwareConfig.getNestedArraySafe("suspiciousPermissions"))
    }

    return talsecBuilder.build()
  }

  companion object {
    const val NAME = "FreeraspReactNative"
    private val THREAT_CHANNEL_NAME = (10000..999999999).random()
      .toString() // name of the channel over which threat callbacks are sent
    private val THREAT_CHANNEL_KEY = (10000..999999999).random()
      .toString() // key of the argument map under which threats are expected
    private val MALWARE_CHANNEL_KEY = (10000..999999999).random()
      .toString() // key of the argument map under which malware data is expected

    private val backgroundHandlerThread = HandlerThread("BackgroundThread").apply { start() }
    private val backgroundHandler = Handler(backgroundHandlerThread.looper)
    private val mainHandler = Handler(Looper.getMainLooper())

    private lateinit var appReactContext: ReactApplicationContext

    internal var talsecStarted = false

    private fun notifyListeners(threat: Threat) {
      val params = Arguments.createMap()
      params.putInt(THREAT_CHANNEL_KEY, threat.value)
      appReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(THREAT_CHANNEL_NAME, params)
    }

    /**
     * Sends malware detected event to React Native
     */
    private fun notifyMalware(suspiciousApps: MutableList<SuspiciousAppInfo>) {
      // Perform the malware encoding on a background thread
      backgroundHandler.post {

        val encodedSuspiciousApps = suspiciousApps.toEncodedWritableArray(appReactContext)

        mainHandler.post {
          val params = Arguments.createMap()
          params.putInt(THREAT_CHANNEL_KEY, Threat.Malware.value)
          params.putArray(
            MALWARE_CHANNEL_KEY, encodedSuspiciousApps
          )

          appReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(THREAT_CHANNEL_NAME, params)
        }
      }
    }
  }

  internal object ThreatListener : FreeraspThreatHandler.TalsecReactNative {
    override fun threatDetected(threatType: Threat) {
      notifyListeners(threatType)
    }

    override fun malwareDetected(suspiciousApps: MutableList<SuspiciousAppInfo>) {
      notifyMalware(suspiciousApps)
    }
  }
}
