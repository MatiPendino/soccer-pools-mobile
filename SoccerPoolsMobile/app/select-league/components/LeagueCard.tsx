import {
    View, Text, Pressable, Image, StyleSheet, ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { Ionicons } from '@expo/vector-icons';
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
            {/* Prize Ribbon */}
            <View style={styles.ribbon}>
                <Ionicons name="trophy" size={12} color={colors.background} />
                <Text style={styles.ribbonText}>
                    {item.coins_prizes.coins_prize_first}
                </Text>
            </View>

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

            {/* Action Area */}
            {isLoading ? (
                <ActivityIndicator size="small" color={colors.accent} />
            ) : item.is_user_joined ? (
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{t('joined')}</Text>
                </View>
            ) : (
                <View style={styles.costContainer}>
                    <View style={styles.costBadge}>
                        <Text style={styles.costText}>{item.coins_cost || 0}</Text>
                        <Ionicons name="flash" size={12} color={colors.coins} />
                    </View>
                    <Text style={styles.tapText}>{t('tap-to-join')}</Text>
                </View>
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
    ribbon: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.coins,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    ribbonText: {
        color: colors.background,
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.bold,
    },
    joinedBadge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
    },
    logoContainer: {
        width: 80,
        height: 80,
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
    costContainer: {
        alignItems: 'center',
    },
    costBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.coinsBg,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    costText: {
        color: colors.coins,
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.bold,
    },
    tapText: {
        color: colors.textMuted,
        fontSize: typography.fontSize.labelSmall,
        marginTop: spacing.xs,
    },
});