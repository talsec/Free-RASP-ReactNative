package com.freeraspreactnative

import android.annotation.SuppressLint
import android.annotation.TargetApi
import android.app.Activity
import android.app.Activity.ScreenCaptureCallback
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import android.view.WindowManager.SCREEN_RECORDING_STATE_VISIBLE
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat

import com.aheaditec.talsec_security.security.api.Talsec
import java.util.function.Consumer

@RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
internal object ScreenProtector {
  private const val TAG = "TalsecScreenProtector"
  private const val SCREEN_CAPTURE_PERMISSION = "android.permission.DETECT_SCREEN_CAPTURE"
  private const val SCREEN_RECORDING_PERMISSION = "android.permission.DETECT_SCREEN_RECORDING"
  private var registered = false
  private val screenCaptureCallback = ScreenCaptureCallback { Talsec.onScreenshotDetected() }
  private val screenRecordCallback: Consumer<Int> = Consumer<Int> { state ->
    if (state == SCREEN_RECORDING_STATE_VISIBLE) {
      Talsec.onScreenRecordingDetected()
    }
  }

  /**
   * Registers screenshot and screen recording detector with the given activity
   *
   * **IMPORTANT**: android.permission.DETECT_SCREEN_CAPTURE and
   * android.permission.DETECT_SCREEN_RECORDING must be
   * granted for the app in the AndroidManifest.xml
   */
  internal fun register(activity: Activity) {
    if (!FreeraspReactNativeModule.talsecStarted || registered) {
      return
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
      registerScreenCapture(activity)
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) {
      registerScreenRecording(activity)
    }
    registered = true
  }

  /**
   * Register Talsec Screen Capture (screenshot) Detector for given activity instance.
   * The MainActivity of the app is registered by the plugin itself, other
   * activities bust be registered manually as described in the integration guide.
   *
   * Missing permission is suppressed because the decision to use the screen
   * capture API is made by developer, and not enforced by the library.
   *
   * **IMPORTANT**: android.permission.DETECT_SCREEN_CAPTURE (API 34+) must be
   * granted for the app in the AndroidManifest.xml
   */
  @RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
  @SuppressLint("MissingPermission")
  private fun registerScreenCapture(activity: Activity) {
    val context = activity.applicationContext
    if (!hasPermission(context, SCREEN_CAPTURE_PERMISSION)) {
      reportMissingPermission("screenshot", SCREEN_CAPTURE_PERMISSION)
      return
    }

    activity.registerScreenCaptureCallback(context.mainExecutor, screenCaptureCallback)
  }

  /**
   * Register Talsec Screen Recording Detector for given activity instance.
   * The MainActivity of the app is registered by the plugin itself, other
   * activities bust be registered manually as described in the integration guide.
   *
   * Missing permission is suppressed because the decision to use the screen
   * capture API is made by developer, and not enforced by the library.
   *
   * **IMPORTANT**: android.permission.DETECT_SCREEN_RECORDING (API 35+) must be
   * granted for the app in the AndroidManifest.xml
   */
  @SuppressLint("MissingPermission")
  @RequiresApi(Build.VERSION_CODES.VANILLA_ICE_CREAM)
  private fun registerScreenRecording(activity: Activity) {
    val context = activity.applicationContext
    if (!hasPermission(context, SCREEN_RECORDING_PERMISSION)) {
      reportMissingPermission("screen record", SCREEN_RECORDING_PERMISSION)
      return
    }

    val initialState = activity.windowManager.addScreenRecordingCallback(
      context.mainExecutor, screenRecordCallback
    )
    screenRecordCallback.accept(initialState)

  }

  /**
   * Unregisters screenshot and screen recording detector with the given activity
   *
   * **IMPORTANT**: android.permission.DETECT_SCREEN_CAPTURE and
   * android.permission.DETECT_SCREEN_RECORDING must be
   * granted for the app in the AndroidManifest.xml
   */
  @SuppressLint("MissingPermission")
  @RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
  internal fun unregister(activity: Activity) {
    if (!FreeraspReactNativeModule.talsecStarted || !registered) {
      return
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
      unregisterScreenCapture(activity)
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) {
      unregisterScreenRecording(activity)
    }
    registered = false
  }

  // Missing permission is suppressed because the decision to use the screen capture API is made
  // by developer, and not enforced by the library.
  @SuppressLint("MissingPermission")
  @RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
  private fun unregisterScreenCapture(activity: Activity) {
    val context = activity.applicationContext
    if (!hasPermission(context, SCREEN_CAPTURE_PERMISSION)) {
      return
    }
    activity.unregisterScreenCaptureCallback(screenCaptureCallback)
  }

  // Missing permission is suppressed because the decision to use the screen capture API is made
  // by developer, and not enforced by the library.
  @SuppressLint("MissingPermission")
  @RequiresApi(Build.VERSION_CODES.VANILLA_ICE_CREAM)
  private fun unregisterScreenRecording(activity: Activity) {
    val context = activity.applicationContext
    if (!hasPermission(context, SCREEN_RECORDING_PERMISSION)) {
      return
    }

    activity.windowManager?.removeScreenRecordingCallback(screenRecordCallback)
  }

  private fun hasPermission(context: Context, permission: String): Boolean {
    return ContextCompat.checkSelfPermission(
      context, permission
    ) == PackageManager.PERMISSION_GRANTED
  }

  private fun reportMissingPermission(protectionType: String, permission: String) {
    Log.e(
      TAG,
      "Failed to register $protectionType callback. Check if $permission permission is granted in AndroidManifest.xml"
    )
  }
}
