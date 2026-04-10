const { withAndroidManifest } = require('expo/config-plugins');

/**
 * Config plugin to support 16 KB memory page sizes on Android.
 * Sets android:extractNativeLibs="false" in AndroidManifest.xml so native
 * libraries are loaded directly from the APK with proper page alignment.
 */
const withAndroid16KBPages = (config) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    mainApplication.$['android:extractNativeLibs'] = 'false';
    return config;
  });
};

module.exports = withAndroid16KBPages;
