import {  Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import { StatusBar } from "expo-status-bar";
import mobileAds from 'react-native-google-mobile-ads';
import * as Sentry from '@sentry/react-native';
import '../i18'

// Admob initialization
mobileAds()
  .initialize()
  .then(adapterStatuses => {
    // Initialization complete!
})

// Sentry initialization
Sentry.init({
    dsn: `https://${process.env.SENTRY_URL}.ingest.us.sentry.io/${process.env.SENTRY_KEY}`,
})

export default function Layout () {
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