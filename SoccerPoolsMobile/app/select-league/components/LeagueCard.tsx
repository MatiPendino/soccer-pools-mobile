import {
    View, Text, Pressable, Image, StyleSheet, ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Router, useRouter } from 'expo-router';
import handleError from 'utils/handleError';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useJoinLeague } from '../../../hooks/useLeagues';
import { colors, spacing, typography, borderRadius } from '../../../theme';

export default function LeagueCard({ item }) {
    const { t } = useTranslation();
    const { width, isLG } = useBreakpoint();
    const toast: ToastType = useToast();
    const router: Router = useRouter();

    const { mutateAsync: joinLeagueAsync, isPending: isLoading } = useJoinLeague();

    const cardWidth: number = isLG ? width * 0.22 : width * 0.44;

    const selectLeague = async () => {
        try {
            const response = await joinLeagueAsync(item.slug);
            if (response.status === 201) {
                toast.show(
                    t('joined-league-successfully', { leagueTitle: item.name }),
                    { type: 'success' }
                );
            }
            router.replace('/home');
        } catch (error) {
            toast.show(handleError(error), { type: 'danger' });
        }
    };

    const entryIsFree = !item.coins_cost || item.coins_cost === 0;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                { width: cardWidth },
                pressed && styles.cardPressed,
            ]}
            onPress={selectLeague}
            disabled={isLoading}
        >
            {/* Status Indicator */}
            {item.is_user_joined && (
                <View style={styles.joinedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                </View>
            )}

            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: item.logo }}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.name} numberOfLines={2}>
                {item.name}
            </Text>

            {/* Info rows */}
            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <View style={styles.infoLabelGroup}>
                        <Ionicons name="trophy" size={12} color={colors.coins} />
                        <Text style={styles.infoLabel}>{t('top-prize')}</Text>
                    </View>
                    <Text style={styles.infoValue}>
                        {item.coins_prizes?.coins_prize_first ?? '—'}
                        <Text style={styles.infoUnit}> coins</Text>
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <View style={styles.infoLabelGroup}>
                        <FontAwesome5 name="coins" size={11} color={colors.coins} />
                        <Text style={styles.infoLabel}>{t('entry-cost')}</Text>
                    </View>

                    {entryIsFree ? (
                        <Text style={styles.freeValue}>{t('free')}</Text>
                    ) : (
                        <Text style={styles.infoValue}>
                            {item.coins_cost}
                            <Text style={styles.infoUnit}> coins</Text>
                        </Text>
                    )}
                </View>
            </View>

            {/* Action Area */}
            {isLoading ? (
                <ActivityIndicator size="small" color={colors.accent} style={styles.loader} />
            ) : item.is_user_joined ? (
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{t('joined')}</Text>
                </View>
            ) : (
                <Text style={styles.tapText}>{t('tap-to-join')}</Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        position: 'relative',
        minHeight: 180,
    },
    cardPressed: {
        backgroundColor: colors.surfaceLight,
        transform: [{ scale: 0.98 }],
    },
    joinedBadge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
    },
    logoContainer: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.md,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        padding: spacing.sm,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: typography.fontSize.titleSmall,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    infoSection: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginBottom: spacing.sm,
        gap: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    infoLabelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoLabel: {
        fontSize: typography.fontSize.labelMedium,
        color: 'white',
    },
    infoValue: {
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    infoUnit: {
        fontWeight: typography.fontWeight.regular,
        color: colors.textMuted,
    },
    freeValue: {
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.bold,
        color: colors.success,
    },
    divider: {
        height: 1,
        backgroundColor: colors.surfaceBorder,
    },
    statusBadge: {
        backgroundColor: colors.successBg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    statusText: {
        color: colors.success,
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.semibold,
    },
    tapText: {
        color: colors.textMuted,
        fontSize: typography.fontSize.labelSmall,
    },
    loader: {
        marginTop: spacing.xs,
    },
});