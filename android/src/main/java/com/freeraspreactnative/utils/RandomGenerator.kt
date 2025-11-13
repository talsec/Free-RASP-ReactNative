package com.freeraspreactnative.utils

internal object RandomGenerator {
  private val generatedNumbers = mutableSetOf<Int>()

  internal fun generateRandomIdentifiers(length: Int): List<Int> {
    val previousLength = generatedNumbers.size
    while (generatedNumbers.size < previousLength + length) {
      generatedNumbers.add((10000..999999999).random())
    }
    return generatedNumbers.toList().takeLast(length)
  }
}
