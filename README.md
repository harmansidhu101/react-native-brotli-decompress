# react-native-brotli-decompress

Brotli decompression for React Native (iOS & Android).

This library was built to solve a real production problem — our backend (Python Django) was compressing API responses with Brotli before sending them, reducing payload sizes by ~75%, but no React Native library existed to decompress them on the client side. Works with Brotli-compressed data from any backend language or library.

Decompresses Brotli-compressed data passed as a Base64 string and returns the decompressed UTF-8 string.

## Installation

```sh
npm install react-native-brotli-decompress
```

### Android

No additional steps required. The library uses the `org.brotli:dec` Java library which is included automatically.

### iOS

```sh
cd ios && pod install
```

## Usage

```js
import { decompress } from 'react-native-brotli-decompress';

// Pass a Base64-encoded Brotli-compressed string
const decompressed = await decompress(base64EncodedData);
console.log(decompressed); // UTF-8 decoded string
```

## API

### `decompress(base64Data: string): Promise<string>`

| Parameter | Type | Description |
|-----------|------|-------------|
| `base64Data` | `string` | Base64-encoded Brotli-compressed data |

**Returns:** `Promise<string>` — the decompressed UTF-8 string.

**Throws:**
- `INVALID_INPUT` — if the input is not valid Base64
- `DECOMPRESSION_FAILED` — if Brotli decompression fails
- `DECODING_FAILED` — if the decompressed bytes are not valid UTF-8

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)