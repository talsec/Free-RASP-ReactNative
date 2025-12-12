package com.freeraspreactnative.utils

import java.security.SecureRandom

internal object RandomGenerator {
    private val secureRandom = SecureRandom()
    private val generatedNumbers = mutableSetOf<Int>()

    internal fun next(): Int {
        val min = 10000
        val max = 999999999
        var nextNumber = secureRandom.nextInt((max - min) + 1) + min
        while (!generatedNumbers.add(nextNumber)) {
            nextNumber = secureRandom.nextInt((max - min) + 1) + min
        }
        return nextNumber
    }
}
