#import "BrotliDecompress.h"
#import "brotli/include/brotli/decode.h"

@implementation BrotliDecompress

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(decompress:(NSString *)base64EncodedData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        NSData *compressedData = [[NSData alloc] initWithBase64EncodedString:base64EncodedData options:0];
        if (!compressedData) {
            reject(@"INVALID_INPUT", @"Failed to decode Base64 string", nil);
            return;
        }

        BrotliDecoderState *state = BrotliDecoderCreateInstance(NULL, NULL, NULL);
        if (!state) {
            reject(@"INIT_FAILED", @"Failed to create Brotli decoder", nil);
            return;
        }

        size_t available_in = compressedData.length;
        const uint8_t *next_in = (const uint8_t *)compressedData.bytes;
        NSMutableData *outputData = [NSMutableData new];

        while (YES) {
            uint8_t buffer[4096];
            size_t available_out = sizeof(buffer);
            uint8_t *next_out = buffer;

            BrotliDecoderResult result = BrotliDecoderDecompressStream(
                state,
                &available_in,
                &next_in,
                &available_out,
                &next_out,
                NULL
            );

            if (result == BROTLI_DECODER_RESULT_ERROR) {
                BrotliDecoderErrorCode errorCode = BrotliDecoderGetErrorCode(state);
                NSString *errorMsg = [NSString stringWithFormat:@"Brotli error: %d", errorCode];
                BrotliDecoderDestroyInstance(state);
                reject(@"DECOMPRESSION_FAILED", errorMsg, nil);
                return;
            }

            size_t decoded = sizeof(buffer) - available_out;
            if (decoded > 0) {
                [outputData appendBytes:buffer length:decoded];
            }

            if (result == BROTLI_DECODER_RESULT_SUCCESS) {
                break;
            }
        }

        BrotliDecoderDestroyInstance(state);

        NSString *decompressedString = [[NSString alloc] initWithData:outputData encoding:NSUTF8StringEncoding];
        if (!decompressedString) {
            reject(@"DECODING_FAILED", @"Failed to decode UTF-8", nil);
            return;
        }

        resolve(decompressedString);
    }
    @catch (NSException *exception) {
        reject(@"DECOMPRESSION_ERROR", exception.reason, nil);
    }
}

@end