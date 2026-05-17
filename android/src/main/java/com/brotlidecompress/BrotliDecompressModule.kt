package com.brotlidecompress

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import org.brotli.dec.BrotliInputStream
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.util.Base64

class BrotliDecompressModule(reactContext: ReactApplicationContext) :
  NativeBrotliDecompressSpec(reactContext) {

  override fun getName(): String = NAME

  override fun decompress(data: String, promise: Promise) {
    try {
      val compressedData = Base64.getDecoder().decode(data)
      val inputStream = ByteArrayInputStream(compressedData)
      val brotliInputStream = BrotliInputStream(inputStream)
      val outputStream = ByteArrayOutputStream()

      val buffer = ByteArray(1024)
      var length: Int
      while (brotliInputStream.read(buffer).also { length = it } != -1) {
        outputStream.write(buffer, 0, length)
      }

      brotliInputStream.close()
      val decompressedString = outputStream.toString("UTF-8")
      promise.resolve(decompressedString)
    } catch (e: IOException) {
      promise.reject("DECOMPRESSION_FAILED", "Failed to decompress data", e)
    } catch (e: IllegalArgumentException) {
      promise.reject("INVALID_BASE64", "Input is not valid Base64", e)
    }
  }

  companion object {
    const val NAME = NativeBrotliDecompressSpec.NAME
  }
}