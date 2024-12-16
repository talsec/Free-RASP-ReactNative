package com.freeraspreactnative.utils

import android.content.pm.ApplicationInfo
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.os.Build
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.ReactContext
import java.io.ByteArrayOutputStream


internal object Utils {

  private fun compressBitmap(bitmap: Bitmap): String {
    val byteArrayOutputStream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.PNG, 10, byteArrayOutputStream)
    val byteArray = byteArrayOutputStream.toByteArray()
    return Base64.encodeToString(byteArray, Base64.NO_WRAP)
  }

  /**
   * Retrieves human-readable application name
   */
  internal fun getAppName(context: ReactContext, applicationInfo: ApplicationInfo?): String? {
    return applicationInfo?.let { context.packageManager.getApplicationLabel(it) as String }
  }

  /**
   * Retrieves app icon for the given package name as Drawable, transforms it to Bitmap,
   * compresses to PNG and finally encodes the data to Base64
   * @param context React Native context
   * @param packageName package name for which icon should be retrieved
   * @return Base-64 encoded string
   */
  internal fun getAppIconAsBase64String(context: ReactContext, packageName: String): String? {
    try {
      val drawable = context.packageManager.getApplicationIcon(packageName)

      if (drawable is BitmapDrawable && drawable.bitmap != null) {
        return compressBitmap(drawable.bitmap)
      }

      if (drawable.intrinsicWidth > 0 && drawable.intrinsicHeight > 0) {
        val bitmap = Bitmap.createBitmap(
          drawable.intrinsicWidth,
          drawable.intrinsicHeight,
          Bitmap.Config.ARGB_8888
        )
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, canvas.width, canvas.height)
        drawable.draw(canvas)
        return compressBitmap(bitmap)
      }
      return null
    } catch (e: Exception) {
      Log.e("Talsec", "Could not retrieve app icon for ${packageName}: ${e.message}")
      return null
    }
  }

  /**
   * Retrieves installation source for the given package name
   * @param context React Native context
   * @param packageName package name for which installation source should be retrieved
   * @return Installation source package name
   */
  @Suppress("DEPRECATION")
  internal fun getInstallationSource(context: ReactContext, packageName: String): String? {
    return try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        context.packageManager.getInstallSourceInfo(packageName).installingPackageName
      } else {
        context.packageManager.getInstallerPackageName(packageName)
      }
    } catch (e: Exception) {
      Log.e(
        "Talsec",
        "Could not retrieve app installation source for ${packageName}: ${e.message}",
      )
      null
    }
  }
}
