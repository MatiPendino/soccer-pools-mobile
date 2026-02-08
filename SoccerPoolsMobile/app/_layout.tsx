import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { ToastProvider } from 'react-native-toast-notifications';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import initializeMobileAds from 'utils/initialize_mobile_ads/initializeMobileAds';
import initializeAnalytics from 'utils/analytics/initializeAnalytics';
import initializeVexo from 'utils/initialize_vexo/initializeVexo';
import { vexoWeb } from 'utils/vexoWeb';
import { paperTheme } from '../theme/paperTheme';
import { colors } from '../theme';
import { GameModeProvider } from '../contexts/GameModeContext';
import '../i18'

// Sentry initialization
Sentry.init({
    dsn: `https://${process.env.SENTRY_URL}.ingest.us.sentry.io/${process.env.SENTRY_KEY}`,
    enabled: !Boolean(Number(process.env.TEST_ADS))
})

// Vexo Analytics Setup
initializeVexo();

// Firebase Analytics Setup
initializeAnalytics();

const queryClient: QueryClient = new QueryClient();

export default function Layout () {
    useEffect(() => {
        // Admob initialization
        initializeMobileAds();

        // Vexo Web Setup
        if (Platform.OS === 'web') {
            vexoWeb();
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <PaperProvider theme={paperTheme}>
                <GameModeProvider>
                    <ToastProvider>
                        <StatusBar style='light' backgroundColor={colors.primaryDarker} />
                        <Stack
                            screenOptions={{
                                headerShown: false,
                            }}
                        />
                    </ToastProvider>
                </GameModeProvider>
            </PaperProvider>
        </QueryClientProvider>
    )
}