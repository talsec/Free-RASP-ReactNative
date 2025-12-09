package com.freeraspreactnative.events

import com.facebook.react.bridge.Arguments
import com.freeraspreactnative.utils.RandomGenerator

internal sealed class RaspExecutionStateEvent(override val value: Int) : BaseRaspEvent {
  override val channelName: String get() = CHANNEL_NAME
  override val channelKey: String get() = CHANNEL_KEY

  data object AllChecksFinished : RaspExecutionStateEvent(RandomGenerator.next())

  companion object Companion {
    internal val CHANNEL_NAME = RandomGenerator.next().toString()
    internal val CHANNEL_KEY = RandomGenerator.next().toString()
    internal val ALL_EVENTS = Arguments.fromList(
      listOf(
        AllChecksFinished
      ).map { it.value })
  }
}
