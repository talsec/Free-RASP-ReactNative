package com.freeraspreactnative.events

import com.facebook.react.bridge.Arguments

internal sealed class RaspExecutionStateEvent(override val value: Int) : BaseRaspEvent {
  override val channelName: String get() = CHANNEL_NAME
  override val channelKey: String get() = CHANNEL_KEY

  data object AllChecksFinished : RaspExecutionStateEvent((10000..999999999).random())

  companion object Companion {
    internal val CHANNEL_NAME = (10000..999999999).random().toString()
    internal val CHANNEL_KEY = (10000..999999999).random().toString()
    internal val ALL_EVENTS = Arguments.fromList(
      listOf(
        AllChecksFinished
      ).map { it.value })
  }
}
