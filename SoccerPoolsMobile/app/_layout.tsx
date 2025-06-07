import { useEffect } from "react";
import { Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import { StatusBar } from "expo-status-bar";
import * as Sentry from '@sentry/react-native';
import initializeMobileAds from "utils/initialize_mobile_ads/initializeMobileAds";
import initializeAnalytics from "utils/analytics/initializeAnalytics";
import initializeVexo from "utils/initialize_vexo/initializeVexo";
import '../i18'

// Sentry initialization
Sentry.init({
    dsn: `https://${process.env.SENTRY_URL}.ingest.us.sentry.io/${process.env.SENTRY_KEY}`,
})

// Vexo Analytics Setup
initializeVexo();

// Firebase Analytics Setup
initializeAnalytics();
  
export default function Layout () {
    useEffect(() => {
        // Admob initialization
        initializeMobileAds();
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