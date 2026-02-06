package com.freeraspreactnative.dispatchers

import com.freeraspreactnative.events.RaspExecutionStateEvent
import com.freeraspreactnative.interfaces.WrapperExecutionStateListener

internal class ExecutionStateDispatcher {
  private val cache = mutableSetOf<RaspExecutionStateEvent>()

  var listener: WrapperExecutionStateListener? = null
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

  private fun flushCache(registeredListener: WrapperExecutionStateListener) {
    synchronized(cache) {
      cache.forEach { registeredListener.raspExecutionStateChanged(it) }
      cache.clear()
    }
  }
}

