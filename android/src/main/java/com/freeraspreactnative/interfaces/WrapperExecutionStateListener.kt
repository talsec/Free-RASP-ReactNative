package com.freeraspreactnative.interfaces

import com.freeraspreactnative.events.RaspExecutionStateEvent

internal interface WrapperExecutionStateListener {
  fun raspExecutionStateChanged(event: RaspExecutionStateEvent)
}
