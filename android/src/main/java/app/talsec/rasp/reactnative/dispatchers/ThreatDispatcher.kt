package app.talsec.rasp.reactnative.dispatchers

import app.talsec.rasp.security.api.SuspiciousAppInfo
import app.talsec.rasp.security.api.ThreatListener.CallState
import app.talsec.rasp.reactnative.events.ThreatEvent
import app.talsec.rasp.reactnative.interfaces.PluginThreatListener

internal object ThreatDispatcher {
  private lateinit var listener: PluginThreatListener
  private val threatCache = mutableSetOf<ThreatEvent>()
  private val malwareCache = mutableSetOf<SuspiciousAppInfo>()
  private val callStateCache = mutableListOf<CallState>()

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

  fun dispatchOngoingCall(state: CallState) {
    if (isAppInForeground && isListenerRegistered) {
      listener.ongoingCallDetected(state)
    } else {
      // Keep the order: a call that started and stopped in background is reported as both.
      synchronized(callStateCache) {
        callStateCache.add(state)
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

    val callStates = synchronized(callStateCache) {
      val snapshot = callStateCache.toList()
      callStateCache.clear()
      snapshot
    }
    callStates.forEach { listener.ongoingCallDetected(it) }
  }
}

