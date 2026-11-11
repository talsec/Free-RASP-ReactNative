package app.talsec.rasp.reactnative.interfaces

import app.talsec.rasp.reactnative.events.RaspExecutionStateEvent

internal interface PluginExecutionStateListener {
  fun raspExecutionStateChanged(event: RaspExecutionStateEvent)
}
