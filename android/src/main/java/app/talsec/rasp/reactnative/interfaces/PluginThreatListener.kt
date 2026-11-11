package com.freeraspreactnative.interfaces

import app.talsec.rasp.security.api.SuspiciousAppInfo
import app.talsec.rasp.security.api.ThreatListener.CallState
import com.freeraspreactnative.events.ThreatEvent

internal interface PluginThreatListener {
  fun threatDetected(threatEventType: ThreatEvent)
  fun malwareDetected(suspiciousApps: MutableList<SuspiciousAppInfo>)
  fun ongoingCallDetected(state: CallState)
}
