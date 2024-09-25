package com.freeraspreactnative

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.freeraspreactnative.exceptions.TalsecException

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

internal fun ReadableArray.toArray(): Array<String> {
  val output = mutableListOf<String>()
  for (i in 0 until this.size()) {
    // in RN versions < 0.63, getString is nullable
    @Suppress("UNNECESSARY_SAFE_CALL")
    this.getString(i)?.let {
      output.add(it)
    }
  }
  return output.toTypedArray()
}

internal fun ReadableMap.getArraySafe(key: String): Array<String> {
  if (this.hasKey(key)) {
    val inputArray = this.getArray(key)!!
    return inputArray.toArray()
  }
  return arrayOf()
}
