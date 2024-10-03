package com.freeraspreactnative.models

import kotlinx.serialization.Serializable


/**
 * Simplified, serializable wrapper for Talsec's SuspiciousAppInfo
 */
@Serializable
data class RNSuspiciousAppInfo(
  val packageInfo: RNPackageInfo,
  val reason: String,
)

/**
 * Simplified, serializable wrapper for Android's PackageInfo
 */
@Serializable
data class RNPackageInfo(
  val packageName: String,
  val appName: String?,
  val version: String?,
  val appIcon: String?,
  val installerStore: String?
)
