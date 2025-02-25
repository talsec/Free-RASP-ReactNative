package com.freeraspreactnative.utils

import android.content.pm.PackageInfo
import android.util.Base64
import android.util.Log
import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.freeraspreactnative.exceptions.TalsecException
import com.freeraspreactnative.models.RNPackageInfo
import com.freeraspreactnative.models.RNSuspiciousAppInfo
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.json.JSONException


internal fun ReadableMap.getMapThrowing(key: String): ReadableMap {
  return this.getMap(key) ?: throw TalsecException("Key missing in configuration: $key")
}

internal fun ReadableMap.getStringThrowing(key: String): String {
  return this.getString(key) ?: throw TalsecException("Key missing in configuration: $key")
}

internal fun ReadableMap.getBooleanSafe(key: String, defaultValue: Boolean = true): Boolean {
  if (this.hasKey(key)) {
    return this.getBoolean(key)
  }
  return defaultValue
}

private inline fun <reified T> ReadableArray.toPrimitiveArray(): Array<T> {
  val output = mutableListOf<T>()

  for (i in 0 until this.size()) {
    val element: T? = when (T::class) {
      String::class -> this.getString(i) as T?
      Int::class -> this.getInt(i) as T?
      Double::class -> this.getDouble(i) as T?
      Boolean::class -> this.getBoolean(i) as T?
      else -> throw JSONException("Cannot parse JSON array - unsupported type")
    }
    element?.let(output::add)
  }
  return output.toTypedArray()
}

internal fun ReadableMap.getArraySafe(key: String): Array<String> {
  if (this.hasKey(key)) {
    val inputArray = this.getArray(key)!!
    return inputArray.toPrimitiveArray()
  }
  return arrayOf()
}

internal fun ReadableMap.getNestedArraySafe(key: String): Array<Array<String>> {
  val outArray = mutableListOf<Array<String>>()
  if (this.hasKey(key)) {
    val inputArray = this.getArray(key)!!
    for (i in 0 until inputArray.size()) {
      inputArray.getArray(i)?.let { outArray.add(it.toPrimitiveArray()) }
    }
  }
  return outArray.toTypedArray()
}


/**
 * Converts the Talsec's SuspiciousAppInfo to React Native equivalent
 */
internal fun SuspiciousAppInfo.toRNSuspiciousAppInfo(context: ReactContext): RNSuspiciousAppInfo {
  return RNSuspiciousAppInfo(
    packageInfo = this.packageInfo.toRNPackageInfo(context),
    reason = this.reason,
  )
}

/**
 * Converts the Android's PackageInfo to React Native equivalent
 */
internal fun PackageInfo.toRNPackageInfo(context: ReactContext): RNPackageInfo {
  return RNPackageInfo(
    packageName = this.packageName,
    appName = Utils.getAppName(context, this.applicationInfo),
    version = this.versionName,
    appIcon = null, // this requires heavier computations, so appIcon has to be retrieved separately
    installerStore = Utils.getInstallationSource(context, this.packageName)
  )
}

/**
 * Convert the Talsec's SuspiciousAppInfo to base64-encoded json array,
 * which can be then sent to React Native
 */
internal fun MutableList<SuspiciousAppInfo>.toEncodedWritableArray(context: ReactContext): WritableArray {
  val output = Arguments.createArray()
  this.forEach { suspiciousAppInfo ->
    val rnSuspiciousAppInfo = suspiciousAppInfo.toRNSuspiciousAppInfo(context)
    try {
      val encodedAppInfo =
        Base64.encodeToString(
          Json.encodeToString(rnSuspiciousAppInfo).toByteArray(),
          Base64.DEFAULT
        )
      output.pushString(encodedAppInfo)
    } catch (e: Exception) {
      Log.e("Talsec", "Could not serialize suspicious app data: ${e.message}")
    }

  }
  return output
}

