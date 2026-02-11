package com.freeraspreactnative.interfaces

import com.freeraspreactnative.events.RaspExecutionStateEvent

internal interface PluginExecutionStateListener {
  fun raspExecutionStateChanged(event: RaspExecutionStateEvent)
}
