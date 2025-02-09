import { useEffect } from "react";
import { Stack } from "expo-router";
import { OneSignal } from 'react-native-onesignal';
import { ToastProvider } from "react-native-toast-notifications";
import { StatusBar } from "expo-status-bar";
import mobileAds from 'react-native-google-mobile-ads';
import * as Sentry from '@sentry/react-native';
import '../i18'

// Sentry initialization
Sentry.init({
    dsn: `https://${process.env.SENTRY_URL}.ingest.us.sentry.io/${process.env.SENTRY_KEY}`,
})
  
export default function Layout () {
    useEffect(() => {
        // Admob initialization
        mobileAds()
            .initialize()
            .then(adapterStatuses => {
            // Initialization complete!
            })


        // OneSignal Initialization
        OneSignal.initialize(process.env.ONE_SIGNAL_APP_ID);

        // requestPermission will show the native iOS or Android notification permission prompt.
        // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
        OneSignal.Notifications.requestPermission(true);

        // Method for listening for notification clicks
        OneSignal.Notifications.addEventListener('click', (event) => {
            console.log('OneSignal: notification clicked:', event);
        });
    }, []);

    return (
        <ToastProvider>
            <StatusBar style="light" backgroundColor="#1C154F" />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </ToastProvider>
    )
}