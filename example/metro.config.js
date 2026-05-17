const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');
const pak = require('../package.json');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration for monorepo setup
 * Manually configures what react-native-monorepo-config does,
 * but compatible with newer Metro versions.
 */
const config = {
  watchFolders: [root],
  resolver: {
    blockList: [
      new RegExp(`${root}/node_modules/react-native/.*`),
    ],
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (target[name]) return target[name];
          return path.join(__dirname, 'node_modules', name.toString());
        },
      }
    ),
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(root, 'node_modules'),
    ],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(defaultConfig, config);