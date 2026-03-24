package com.freeraspreactnative.dispatchers

import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.freeraspreactnative.events.ThreatEvent
import com.freeraspreactnative.interfaces.PluginThreatListener

internal object ThreatDispatcher {
  private lateinit var listener: PluginThreatListener
  private val threatCache = mutableSetOf<ThreatEvent>()
  private val malwareCache = mutableSetOf<SuspiciousAppInfo>()

  private var isAppInForeground = false
  private var isListenerRegistered = false

  fun registerListener(newListener: PluginThreatListener) {
    listener = newListener
    isListenerRegistered = true
    isAppInForeground = true
    flushCache()
  }

  fun unregisterListener() {
    isListenerRegistered = false
    isAppInForeground = false
  }

  fun onResume() {
    isAppInForeground = true
    if (isListenerRegistered) {
      flushCache()
    }
  }

  fun onPause() {
    isAppInForeground = false
  }

  fun dispatchThreat(event: ThreatEvent) {
    if (isAppInForeground && isListenerRegistered) {
      listener.threatDetected(event)
    } else {
      synchronized(threatCache) {
        threatCache.add(event)
      }
    }
  }

  fun dispatchMalware(apps: MutableList<SuspiciousAppInfo>) {
    if (isAppInForeground && isListenerRegistered) {
      listener.malwareDetected(apps)
    }
    else {
      synchronized(malwareCache) {
        malwareCache.addAll(apps)
      }
    }
  }

  private fun flushCache() {
    val threats = synchronized(threatCache) {
      val snapshot = threatCache.toSet()
      threatCache.clear()
      snapshot
    }
    threats.forEach { listener.threatDetected(it) }

    val malware = synchronized(malwareCache) {
      val snapshot = malwareCache.toMutableList()
      malwareCache.clear()
      snapshot
    }
    if (malware.isNotEmpty()) {
      listener.malwareDetected(malware)
    }
  }
}

