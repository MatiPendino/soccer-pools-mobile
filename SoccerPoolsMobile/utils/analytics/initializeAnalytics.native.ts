import analytics from '@react-native-firebase/analytics';

export default function initializeAnalytics() {
    analytics().logAppOpen();
}