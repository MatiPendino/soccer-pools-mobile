import {  Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import { StatusBar } from "expo-status-bar";
import * as Sentry from '@sentry/react-native';
import '../i18'

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