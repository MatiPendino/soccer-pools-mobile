import mobileAds from 'react-native-google-mobile-ads';
import * as Sentry from '@sentry/react-native';

export default function initializeMobileAds() {
    try {
        mobileAds().initialize();
    } catch (error) {
        Sentry.captureException(error);
    }
}