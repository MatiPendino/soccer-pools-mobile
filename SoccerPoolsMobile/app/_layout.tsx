import {  Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import { StatusBar } from "expo-status-bar";
import '../i18'


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