import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  decompress(data: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BrotliDecompress');
