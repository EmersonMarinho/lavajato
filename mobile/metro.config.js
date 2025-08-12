const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle react-dom issue (if any other packages need it)
config.resolver.alias = {
  'react-dom': 'react-native',
};

// Add platform-specific extensions
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

// Add resolver configuration for problematic packages
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
