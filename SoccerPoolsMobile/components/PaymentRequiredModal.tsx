import { Modal, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';
import { useCreateRoundPayment, useCreateLeaguePayment } from '../hooks/usePayment';
import { useGameMode } from '../contexts/GameModeContext';
import { colors, spacing, typography, borderRadius } from '../theme';
import handleError from '../utils/handleError';

interface PaymentRequiredModalProps {
    visible: boolean;
    onClose: () => void;
    roundId: number;
    roundName?: string;
}

export default function PaymentRequiredModal({
    visible, onClose, roundId, roundName,
}: PaymentRequiredModalProps) {
    const { t } = useTranslation();
    const toast = useToast();
    const { selectedPaidLeague } = useGameMode();

    const { 
        mutateAsync: createRoundPayment, isPending: isRoundPaymentLoading 
    } = useCreateRoundPayment();
    const { 
        mutateAsync: createLeaguePayment, isPending: isLeaguePaymentLoading 
    } = useCreateLeaguePayment();

    const isLoading = isRoundPaymentLoading || isLeaguePaymentLoading;

    const handleRoundPayment = async () => {
        try {
            await createRoundPayment(roundId);
            onClose();
        } catch (error) {
            toast.show(handleError(error), { type: 'danger' });
        }
    };

    const handleLeaguePayment = async () => {
        if (!selectedPaidLeague?.league?.slug) {
            toast.show('No league selected', { type: 'danger' });
            return;
        }
        try {
            await createLeaguePayment(selectedPaidLeague.league.slug);
            onClose();
        } catch (error) {
            toast.show(handleError(error), { type: 'danger' });
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="lock-closed" size={32} color={colors.coins} />
                        </View>
                        <Pressable style={styles.closeButton} onPress={onClose} disabled={isLoading}>
                            <Ionicons name="close" size={24} color={colors.textMuted} />
                        </Pressable>
                    </View>

                    <Text style={styles.title}>{t('pay-to-play')}</Text>
                    {roundName && (
                        <Text style={styles.roundName}>{roundName}</Text>
                    )}

                    <Text style={styles.description}>
                        {t('real-mode-warning')}
                    </Text>

                    {/* Payment Options */}
                    <View style={styles.optionsContainer}>
                        <Pressable
                            style={[styles.optionButton, styles.roundButton]}
                            onPress={handleRoundPayment}
                            disabled={isLoading}
                        >
                            {isRoundPaymentLoading ? (
                                <ActivityIndicator color={colors.background} />
                            ) : (
                                <>
                                    <Ionicons name="calendar-outline" size={20} color={colors.background} />
                                    <View style={styles.optionTextContainer}>
                                        <Text style={styles.optionTitle}>{t('pay-round')}</Text>
                                        {selectedPaidLeague && (
                                            <Text style={styles.optionPrice}>
                                                ${selectedPaidLeague.round_price_ars} ARS
                                            </Text>
                                        )}
                                    </View>
                                </>
                            )}
                        </Pressable>

                        {/* Pay for Full League */}
                        {selectedPaidLeague?.league_price_ars && (
                            <Pressable
                                style={[styles.optionButton, styles.leagueButton]}
                                onPress={handleLeaguePayment}
                                disabled={isLoading}
                            >
                                {isLeaguePaymentLoading ? (
                                    <ActivityIndicator color={colors.coins} />
                                ) : (
                                    <>
                                        <Ionicons name="trophy-outline" size={20} color={colors.coins} />
                                        <View style={styles.optionTextContainer}>
                                            <Text style={styles.optionTitleAlt}>
                                                {t('pay-league')}
                                            </Text>
                                            <Text style={styles.optionPriceAlt}>
                                                ${selectedPaidLeague.league_price_ars} ARS
                                                <Text style={styles.discountText}> 
                                                    {t('league-discount')}
                                                </Text>
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </Pressable>
                        )}
                    </View>

                    {/* Prize Info */}
                    <View style={styles.prizeInfo}>
                        <Text style={styles.prizeInfoText}>{t('first-place-prize')}</Text>
                        <Text style={styles.prizeInfoText}>{t('second-place-prize')}</Text>
                        <Text style={styles.prizeInfoText}>{t('third-place-prize')}</Text>
                    </View>

                    {/* Cancel Button */}
                    <Pressable style={styles.cancelButton} onPress={onClose} disabled={isLoading}>
                        <Text style={styles.cancelText}>{t('cancel')}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modal: {
        backgroundColor: colors.backgroundElevated,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: colors.coins,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.full,
        backgroundColor: colors.coinsBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        padding: spacing.xs,
    },
    title: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.headlineSmall,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xs,
    },
    roundName: {
        color: colors.coins,
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing.md,
    },
    description: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodyMedium,
        marginBottom: spacing.lg,
    },
    optionsContainer: {
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        gap: spacing.md,
    },
    roundButton: {
        backgroundColor: colors.coins,
    },
    leagueButton: {
        backgroundColor: colors.coinsBg,
        borderWidth: 1,
        borderColor: colors.coins,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        color: colors.background,
        fontSize: typography.fontSize.titleSmall,
        fontWeight: typography.fontWeight.semibold,
    },
    optionTitleAlt: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleSmall,
        fontWeight: typography.fontWeight.semibold,
    },
    optionPrice: {
        color: colors.background,
        fontSize: typography.fontSize.bodySmall,
        opacity: 0.9,
    },
    optionPriceAlt: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodySmall,
    },
    discountText: {
        color: colors.success,
        fontSize: typography.fontSize.labelSmall,
    },
    prizeInfo: {
        backgroundColor: colors.surfaceLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    prizeInfoText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodySmall,
        marginBottom: spacing.xs,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    cancelText: {
        color: colors.textMuted,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.medium,
    },
});
