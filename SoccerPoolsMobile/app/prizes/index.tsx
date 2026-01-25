import { 
    FlatList, Platform, ScrollView, StyleSheet, Text, View, Pressable, ActivityIndicator
} from 'react-native';
import { Link, Router, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';
import handleError from 'utils/handleError';
import { useBreakpoint } from 'hooks/useBreakpoint';
import Footer from 'components/footer/Footer';
import CoinsDisplay from 'components/CoinsDisplay';
import { toCapitalCase } from 'utils/helper';
import { usePrizes, useClaimPrize } from '../../hooks/usePrizes';
import { useUserCoins } from '../../hooks/useUser';
import { colors, spacing, typography, borderRadius } from '../../theme';
import PrizeCard from './components/prize-card/PrizeCard';

export default function Prizes() {
    const toast: ToastType = useToast();
    const router: Router = useRouter();
    const { t } = useTranslation();
    const { backto, referralCode } = useLocalSearchParams();
    const { isLG } = useBreakpoint();

    const { data: prizes, isLoading: isPrizesLoading } = usePrizes();
    const { data: userCoins, isLoading: isCoinsLoading } = useUserCoins();
    const { mutate: claimPrize, isPending: isClaiming } = useClaimPrize();

    const onClaim = (prizeId: number) => {
        if (!userCoins) {
            router.push('login');
            return;
        }

        claimPrize(prizeId, {
            onSuccess: () => {
                toast.show(t('prize-claimed-successfully'), { type: 'success' });
            },
            onError: (error) => {
                toast.show(handleError(error.message), { type: 'danger' });
            }
        });
    };

    return (
        <ScrollView style={styles.screen}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Link
                    href={
                        backto === 'home'
                            ? '/home'
                            : `/?referralCode=${referralCode ? referralCode : ''}`
                    }
                    asChild
                >
                    <Pressable style={({ pressed }) => [
                        styles.backButton,
                        pressed && styles.backButtonPressed
                    ]}>
                        <Ionicons name="chevron-back" color={colors.textPrimary} size={24} />
                    </Pressable>
                </Link>

                <View style={styles.headerContent}>
                    <View style={styles.badge}>
                        <Ionicons name="gift-outline" size={14} color={colors.accent} />
                        <Text style={styles.badgeText}>{t('rewards')}</Text>
                    </View>
                    <Text style={[styles.headerTitle, isLG && styles.headerTitleLG]}>
                        {toCapitalCase(t('prizes'))}
                    </Text>
                    <Text style={styles.subtitle}>{t('claim-rewards')}</Text>
                </View>

                {!isCoinsLoading && userCoins && (
                    <View style={styles.coinsContainer}>
                        <CoinsDisplay coins={userCoins.coins || 0} />
                    </View>
                )}
            </View>

            {/* Description */}
            <View style={styles.descriptionContainer}>
                <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
                <Text style={[styles.description, { fontSize: isLG ? 15 : 14 }]}>
                    {t('all-prizes-free')}
                </Text>
            </View>

            {/* Prizes Grid */}
            <View style={styles.prizesSection}>
                {isPrizesLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={styles.loaderText}>{t('loading')}...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={prizes}
                        renderItem={({ item }) => (
                            <PrizeCard
                                key={item.id}
                                prize={item}
                                onClaim={onClaim}
                                isClaiming={isClaiming}
                            />
                        )}
                        numColumns={isLG ? 3 : 2}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={styles.columnWrapper}
                    />
                )}
            </View>

            {Platform.OS === 'web' && <Footer />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        paddingTop: Platform.OS === 'web' ? spacing.xl : spacing.xxl,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.backgroundElevated,
        borderBottomLeftRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
        marginBottom: spacing.md,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'web' ? spacing.md : spacing.xl,
        left: spacing.md,
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    backButtonPressed: {
        backgroundColor: colors.accent,
    },
    headerContent: {
        alignItems: 'center',
        marginTop: spacing.md,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.accentMuted,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        marginBottom: spacing.sm,
    },
    badgeText: {
        color: colors.accent,
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: typography.fontSize.headlineMedium,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    headerTitleLG: {
        fontSize: typography.fontSize.headlineLarge,
    },
    subtitle: {
        fontSize: typography.fontSize.bodyMedium,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    coinsContainer: {
        position: 'absolute',
        top: Platform.OS === 'web' ? spacing.md : spacing.xl,
        right: spacing.md,
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.accentMuted,
        marginHorizontal: spacing.md,
        marginVertical: spacing.md,
        padding: spacing.md,
        borderRadius: borderRadius.md,
    },
    description: {
        color: colors.textSecondary,
        flex: 1,
        lineHeight: 20,
    },
    prizesSection: {
        flex: 1,
    },
    listContainer: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xxl,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxxl,
    },
    loaderText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodyMedium,
        marginTop: spacing.md,
    },
});