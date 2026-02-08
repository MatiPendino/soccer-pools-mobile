import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function PaymentFailureScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const handleRetry = () => {
        router.replace('/select-paid-league');
    };

    const handleGoHome = () => {
        router.replace('/home');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="close-circle" size={80} color={colors.error} />
                </View>

                <Text style={styles.title}>{t('payment-rejected')}</Text>
                <Text style={styles.description}>
                    {t('payment-failure-message') || 'Your payment could not be processed. Please try again or use a different payment method.'}
                </Text>

                <View style={styles.actionsContainer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.primaryButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleRetry}
                    >
                        <Ionicons name="refresh-outline" size={20} color={colors.background} />
                        <Text style={styles.primaryButtonText}>
                            {t('retry-payment') || 'Try Again'}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.secondaryButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleGoHome}
                    >
                        <Ionicons name="home-outline" size={20} color={colors.textPrimary} />
                        <Text style={styles.secondaryButtonText}>{t('home')}</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    iconContainer: {
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: typography.fontSize.headlineLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.error,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    description: {
        fontSize: typography.fontSize.bodyLarge,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xxl,
        maxWidth: 300,
    },
    actionsContainer: {
        width: '100%',
        maxWidth: 300,
        gap: spacing.md,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.error,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
        gap: spacing.sm,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceLight,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        gap: spacing.sm,
    },
    buttonPressed: {
        opacity: 0.8,
    },
    primaryButtonText: {
        color: colors.background,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    secondaryButtonText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.medium,
    },
});
