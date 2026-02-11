package com.freeraspreactnative.interfaces

import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.freeraspreactnative.events.ThreatEvent

internal interface PluginThreatListener {
  fun threatDetected(threatEventType: ThreatEvent)
  fun malwareDetected(suspiciousApps: MutableList<SuspiciousAppInfo>)
}
