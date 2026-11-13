package app.talsec.rasp.reactnative.events

internal interface BaseRaspEvent {
  val value: Int
  val channelName: String
  val channelKey: String
}
