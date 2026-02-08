import {
    View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Platform, Pressable
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Link, Redirect } from 'expo-router';
import { PageHeader } from '../../components/ui';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { usePaidLeagues } from '../../hooks/usePayment';
import { useGameMode } from '../../contexts/GameModeContext';
import { colors, spacing, typography, borderRadius } from '../../theme';
import PaidLeagueCard from './components/PaidLeagueCard';

const PaidLeagueSelectionScreen = () => {
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();
    const { isRealMoneyAvailable, selectedPaidLeague } = useGameMode();

    // Redirect to regular league selection if not on web
    if (!isRealMoneyAvailable) {
        return <Redirect href="/select-league" />;
    }

    const { data: paidLeagues, isLoading } = usePaidLeagues();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                {selectedPaidLeague ? (
                    <Link href="/home" asChild>
                        <Pressable style={styles.backButton}>
                            <Ionicons name="chevron-back" color={colors.textPrimary} size={24} />
                        </Pressable>
                    </Link>
                ) : (
                    <View style={{ width: 40 }} />
                )}

                <View style={styles.titleContainer}>
                    <Text style={styles.topBarTitle}>{t('select-league')}</Text>
                    <View style={styles.realModeBadge}>
                        <Ionicons name="cash" size={14} color={colors.background} />
                        <Text style={styles.realModeText}>{t('real-mode')}</Text>
                    </View>
                </View>

                <View style={{ width: 40 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={styles.sectionHeader}>
                    <PageHeader
                        badgeIcon="cash-outline"
                        badgeText={t('real-mode')}
                        title={t('choose-your-league')}
                    />
                    <Text style={styles.description}>
                        {t('real-mode-warning')}
                    </Text>
                </View>

                {/* Prize Distribution Info */}
                <View style={styles.prizeInfoContainer}>
                    <View style={styles.prizeInfoHeader}>
                        <Ionicons name="trophy" size={20} color={colors.coins} />
                        <Text style={styles.prizeInfoTitle}>{t('prize-pool')}</Text>
                    </View>
                    <View style={styles.prizeDistribution}>
                        <Text style={styles.prizeText}>{t('first-place-prize')}</Text>
                        <Text style={styles.prizeText}>{t('second-place-prize')}</Text>
                        <Text style={styles.prizeText}>{t('third-place-prize')}</Text>
                    </View>
                </View>

                {/* Paid Leagues Grid */}
                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={colors.coins} />
                        <Text style={styles.loaderText}>{t('loading')}...</Text>
                    </View>
                ) : paidLeagues && paidLeagues.length > 0 ? (
                    <FlatList
                        data={paidLeagues}
                        renderItem={({ item }) => <PaidLeagueCard item={item} />}
                        keyExtractor={item => item.id.toString()}
                        numColumns={isLG ? 4 : 2}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={styles.columnWrapper}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
                        <Text style={styles.emptyText}>No paid leagues available</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center'
    },
    topBar: {
        backgroundColor: colors.backgroundElevated,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        marginTop: Platform.OS === 'web' ? 0 : 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.coins,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        alignItems: 'center',
    },
    topBarTitle: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    realModeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.coins,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        marginTop: spacing.xs,
    },
    realModeText: {
        color: colors.background,
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.bold,
    },
    content: {
        flex: 1,
        paddingTop: spacing.lg,
    },
    sectionHeader: {
        marginBottom: spacing.md,
        paddingHorizontal: spacing.md,
    },
    description: {
        color: colors.coins,
        fontSize: typography.fontSize.bodySmall,
        marginTop: spacing.sm,
    },
    prizeInfoContainer: {
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
        backgroundColor: colors.coinsBg,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.coins,
    },
    prizeInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    prizeInfoTitle: {
        color: colors.coins,
        fontSize: typography.fontSize.titleSmall,
        fontWeight: typography.fontWeight.semibold,
    },
    prizeDistribution: {
        gap: spacing.xs,
    },
    prizeText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodySmall,
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodyMedium,
        marginTop: spacing.md,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
    },
    emptyText: {
        color: colors.textMuted,
        fontSize: typography.fontSize.bodyMedium,
    },
});

export default PaidLeagueSelectionScreen;
