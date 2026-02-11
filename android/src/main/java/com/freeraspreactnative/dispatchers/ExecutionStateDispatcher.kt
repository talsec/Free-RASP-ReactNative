package com.freeraspreactnative.dispatchers

import com.freeraspreactnative.events.RaspExecutionStateEvent
import com.freeraspreactnative.interfaces.PluginExecutionStateListener

internal class ExecutionStateDispatcher {
  private val cache = mutableSetOf<RaspExecutionStateEvent>()

  var listener: PluginExecutionStateListener? = null
    set(value) {
      field = value
      if (value != null) {
        flushCache(value)
      }
    }

  fun dispatch(event: RaspExecutionStateEvent) {
    val currentListener = listener
    if (currentListener != null) {
      currentListener.raspExecutionStateChanged(event)
    } else {
      synchronized(cache) {
        val checkedListener = listener
        checkedListener?.raspExecutionStateChanged(event) ?: cache.add(event)
      }
    }
  }

  private fun flushCache(registeredListener: PluginExecutionStateListener) {
    val events = synchronized(cache) {
      val snapshot = cache.toSet()
      cache.clear()
      snapshot
    }
    events.forEach { registeredListener.raspExecutionStateChanged(it) }
  }
}

