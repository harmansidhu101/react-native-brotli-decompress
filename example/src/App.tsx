import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { decompress } from 'react-native-brotli-decompress';

const SMALL_DATA =
  'G1AAQERPliqhKEFSqiHYbLZPARtw4HA0TrQtOmyMne+KcGpL9VrF3jQPwe5MlJNgi5/1xiI3xQIVgLwA';

const LARGE_DATA =
  'GwFVIio2SYhl8S5iZakzJSXGk078FJxaZC+vry9//zDyx8Hddr6WeJwWB+UUVVizdKWtDZ0AKbIz+H+dvwQjkao576plSiJM2yk+akH+NcLgWF4Ve6nEKKCSicn5zuoi5SEzfEKL4ERnyZYCWhDCaGChzLKV3CfCeuV5H4Ihmzin/dv3K7Oe78f3UPPYf7sMr/f5nnHzFc7v50tC/ZHX7ff9Xrk89M3yD+GX2+lROXk2Xq4ZDo8y6UymLW+KCR8XXF5l0/23v//394LHp1x69Xvqmo1DMBSk2Kl//vwekqkwxpcFXyiWopAOf6LZinsZDEeJEL8Rlqs0VvxX1e8vV14GXv7q3otDacdjjDKhkX/yGqtsaMs3kc845ZreQviLYUCBU83BNKiwWb5YhhT104sG27BixX5wjCgJ5fAX16jSbmVw3/C+EftG4vnteIxRZn3wXSzdeI1Vtsu+aJST7zZcc2tvMvLCNttDHMwENnwnyQI12ht5YZvt4CbmQJq8LSMX2nRv5INrrqKPo18emGbeNlwfcM2NMR9cczXFwQxAg/dhZAIbbo58cM2VdBezwY3f5pEDabI28sE119EdvMYENCjlXANAgzllABp0chPzCQ0q+coANNgjA9CglpMFavQaPrPBjdfIADTo5A7mQpu+hMc1ATac3Exgw27dxWsCbFitH/mEhmObCWxYrq9MYMNXcbJAjfbIBDbs1iNHaFitr1xo0z2yQI3ac64FqFF1Pq8FqNHYZYEadecOZgDO3/jMAk3LlQVaPnxmg08nCzQq75UrzModvDbgxpPIBs/am+UVZu0m5oM7nWzwrJ1MYdxOFuh8ssGj9sgRZu0rF3o+OZDhONcBMhuf1wHy8ORARuO9MoThuIOZwG8gBzIbb5YtzMZNzIGcTg5kNM51gU7XuS7QxzcXOlqPfMJsfWUAzicXOl0nSxiuz2zw6eRCR+u9coXp+ndvWWq+knN7dIShaUb0+glL2+yWjoCja25JxwEgNBC9DpDYcFGHQKRGWzoAkxuLXj4glCZbOoBSm+7p7zP5j5n8P+b7QS01t9PttNJcTn/q4OjOL0vN9XQrgcT1jVIXiLQsn2DycjkQyu6OqS8odVcez/f9sO/tW67nOzerT8/m0Q+Wdld+wNEtl1sJICzvoXoAietygUjb5RNM3t1MdSCUXfmCUpfL4/m9m9Pn5/LoCEOzLD9haZfL3YQTfXguj3YAwrJ8Aon75W6CSGfvsx6AybtyIJTl8gWl7m64ejzHu0F9YJDWEYZmudzO59gb6MODPNrB0e3KA0DYLrcSSFzfgnWBSMvyCSYvlwOh7O7F+oJSd+Vxw4M4TtcNISJnAYmz9BCIw/QFIHwBQOI4HRBpG58C8fEEEmfp7aDUZdzKG0FqNHog0rC8n0AalrspkB4vEGlYDpC4jwMifQEg0qw8BNKwfEGpXwCYPG3nxpCH7fPGkB9vMHnW3g5A2MatBBK/AjB52N4PTF7G3YRQzgdMnrVzEyjjcW4CpckgIZTZeAiU4fgCEL4ACGU8Doi0jU8w+XwglNl4Oyh1GbfyplCbjgpKHa73E6jDdTfh6M4HSh2uAyTu44BIXwCUOlsPCGUZX1DqafzJ918U/v7u3t//';

export default function App() {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<string>('');

  const test = async (data: string, label: string) => {
    setLoading(true);
    setResult('');
    setError('');
    setStats('');
    const start = Date.now();
    try {
      const output = await decompress(data);
      const elapsed = Date.now() - start;
      let display: string;
      try {
        const parsed = JSON.parse(output);
        display = JSON.stringify(parsed).slice(0, 200) + '...';
      } catch {
        display = output;
      }
      setStats(
        `✅ ${label}: ${output.length.toLocaleString()} chars in ${elapsed}ms`
      );
      setResult(display);
    } catch (e: any) {
      setError(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Brotli Decompression Test</Text>
      <Button
        title="Test Small (80 bytes)"
        onPress={() => test(SMALL_DATA, 'Small')}
      />
      <View style={styles.gap} />
      <Button
        title="Test Large (373KB JSON)"
        onPress={() => test(LARGE_DATA, 'Large')}
      />
      {loading && <ActivityIndicator style={styles.spacing} />}
      {stats ? <Text style={styles.stats}>{stats}</Text> : null}
      {result ? <Text style={styles.result}>{result}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  gap: { height: 10 },
  spacing: { marginTop: 20 },
  stats: {
    marginTop: 20,
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  result: { marginTop: 10, color: '#333', fontSize: 11, textAlign: 'center' },
  error: { marginTop: 20, color: 'red', textAlign: 'center' },
});
