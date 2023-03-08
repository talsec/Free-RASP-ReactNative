package com.freeraspreactnative

import com.aheaditec.talsec_security.security.api.ThreatListener

internal object FreeraspDeviceStateListener: ThreatListener.DeviceState {

  internal var listener: DeviceStateListener? = null

  override fun onUnlockedDeviceDetected() {
    "unlockedDevice".let {
      listener?.deviceStateChangeDetected("passcode")
    }
  }

  override fun onHardwareBackedKeystoreNotAvailableDetected() {
    "hardwareBackedKeystoreNotAvailable".let {
      listener?.deviceStateChangeDetected(it)
    }
  }

  internal interface DeviceStateListener {
    fun deviceStateChangeDetected(threatType: String)
  }

}
