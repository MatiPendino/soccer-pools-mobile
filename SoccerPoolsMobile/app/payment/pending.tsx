import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function PaymentPendingScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const handleCheckStatus = () => {
        router.replace('/profile/payment-history');
    };

    const handleGoHome = () => {
        router.replace('/home');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="time-outline" size={80} color={colors.warning} />
                </View>

                <Text style={styles.title}>{t('payment-pending')}</Text>
                <Text style={styles.description}>
                    {t('payment-pending-message') || 'Your payment is being processed. This may take a few moments. You can check the status in your payment history.'}
                </Text>

                <View style={styles.actionsContainer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.primaryButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleCheckStatus}
                    >
                        <Ionicons name="receipt-outline" size={20} color={colors.background} />
                        <Text style={styles.primaryButtonText}>
                            {t('check-payment-status') || 'Check Status'}
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
        color: colors.warning,
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
        backgroundColor: colors.warning,
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
