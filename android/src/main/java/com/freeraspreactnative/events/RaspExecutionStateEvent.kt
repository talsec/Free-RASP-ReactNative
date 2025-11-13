package com.freeraspreactnative.events

import com.facebook.react.bridge.Arguments
import com.freeraspreactnative.utils.RandomGenerator.generateRandomIdentifiers

internal sealed class RaspExecutionStateEvent(override val value: Int) : BaseRaspEvent {
  override val channelName: String get() = CHANNEL_NAME
  override val channelKey: String get() = CHANNEL_KEY

  data object AllChecksFinished : RaspExecutionStateEvent(identifiers[2])

  companion object Companion {
    val identifiers = generateRandomIdentifiers(3)
    internal val CHANNEL_NAME = identifiers[0].toString()
    internal val CHANNEL_KEY = identifiers[1].toString()
    internal val ALL_EVENTS = Arguments.fromList(
      listOf(
        AllChecksFinished
      ).map { it.value })
  }
}
