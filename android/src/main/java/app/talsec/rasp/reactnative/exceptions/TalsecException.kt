package com.freeraspreactnative.exceptions

class TalsecException(message: String, val code: String? = null, val ex: Exception? = null) : Exception(message)
