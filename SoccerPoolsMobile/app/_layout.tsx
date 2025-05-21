import { useEffect } from "react";
import { Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import { StatusBar } from "expo-status-bar";
import mobileAds from 'react-native-google-mobile-ads';
import * as Sentry from '@sentry/react-native';
import { vexo } from 'vexo-analytics';
import analytics from '@react-native-firebase/analytics';
import '../i18'

// Sentry initialization
Sentry.init({
    dsn: `https://${process.env.SENTRY_URL}.ingest.us.sentry.io/${process.env.SENTRY_KEY}`,
})

// Vexo Analytics Setup
vexo(process.env.VEXO_API_KEY);

// Firebase Analytics Setup
analytics().logAppOpen();
  
export default function Layout () {
    useEffect(() => {
        // Admob initialization
        mobileAds()
            .initialize()
            .then(adapterStatuses => {
            // Initialization complete!
            })
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