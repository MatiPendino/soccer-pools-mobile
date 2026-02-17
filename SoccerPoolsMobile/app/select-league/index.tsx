import { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Platform, Pressable
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import CoinsDisplay from '../../components/CoinsDisplay';
import { PageHeader } from '../../components/ui';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useLeagues } from '../../hooks/useLeagues';
import { useUserCoins } from '../../hooks/useUser';
import { usePaidLeagues } from '../../hooks/usePayment';
import { useGameMode, GameMode } from '../../contexts/GameModeContext';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { ContinentProps } from '../../types';
import LeagueCard from './components/LeagueCard';
import Continents from './components/Continents';
import PaidLeagueCard from './components/PaidLeagueCard';

const LeagueSelectionScreen = () => {
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();
    const {
        gameMode, setGameMode, isRealMoneyAvailable, selectedPaidLeague,
    } = useGameMode();

    const CONTINENTS_DATA: ContinentProps[] = [
        { id: 6, name: t('all') },
        { id: 5, name: t('tournaments') },
        { id: 0, name: t('americas') },
        { id: 1, name: t('europe') },
        { id: 2, name: t('africa') },
        { id: 3, name: t('asia') },
        { id: 4, name: t('oceania') },
    ];

    const [selectedContinent, setSelectedContinent] = useState<ContinentProps>(CONTINENTS_DATA[0]);
    const [viewMode, setViewMode] = useState<GameMode>(
        isRealMoneyAvailable && gameMode === 'real' ? 'real' : 'free'
    );

    const { data: leagues, isLoading: isLeaguesLoading } = useLeagues(selectedContinent.id);
    const { data: userCoins, isLoading: isCoinsLoading } = useUserCoins();
    const { data: paidLeagues, isLoading: isPaidLeaguesLoading } = usePaidLeagues();

    const handleViewModeChange = (mode: GameMode) => {
        setViewMode(mode);
        setGameMode(mode);
    };

    const renderHomeLink = () => {
        const showBack = viewMode === 'free'
            ? (!isLeaguesLoading && leagues && leagues.some(league => league.is_user_joined))
            : !!selectedPaidLeague;

        if (showBack) {
            return (
                <Link href="/home" asChild>
                    <Pressable style={styles.backButton}>
                        <Ionicons name="chevron-back" color={colors.textPrimary} size={24} />
                    </Pressable>
                </Link>
            );
        }
        return <View style={{ width: 40 }} />;
    };

    const renderModeToggle = () => {
        if (!isRealMoneyAvailable) return null;

        return (
            <View style={[styles.toggleContainer, isLG && styles.toggleContainerLG]}>
                <Pressable
                    onPress={() => handleViewModeChange('free')}
                    style={[
                        styles.toggleButton,
                        styles.toggleButtonLeft,
                        viewMode === 'free' && styles.toggleButtonActiveFree,
                    ]}
                >
                    <Ionicons
                        name="game-controller"
                        size={16}
                        color={viewMode === 'free' ? colors.background : colors.textSecondary}
                    />
                    <Text style={[
                        styles.toggleButtonText,
                        viewMode === 'free' && styles.toggleButtonTextActive,
                    ]}>
                        {t('free-mode')}
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => handleViewModeChange('real')}
                    style={[
                        styles.toggleButton,
                        styles.toggleButtonRight,
                        viewMode === 'real' && styles.toggleButtonActiveReal,
                    ]}
                >
                    <Ionicons
                        name="cash"
                        size={16}
                        color={viewMode === 'real' ? colors.background : colors.textSecondary}
                    />
                    <Text style={[
                        styles.toggleButtonText,
                        viewMode === 'real' && styles.toggleButtonTextActiveReal,
                    ]}>
                        {t('real-mode')}
                    </Text>
                </Pressable>
            </View>
        );
    };

    const renderFreeContent = () => (
        <>
            <View style={styles.sectionHeader}>
                <PageHeader
                    badgeIcon="trophy-outline"
                    badgeText={t('choose-your-league')}
                    title={t('select-league')}
                />
            </View>

            {/* Continent Tabs */}
            <View style={styles.tabsContainer}>
                <FlatList
                    data={CONTINENTS_DATA}
                    renderItem={({ item }) => (
                        <Continents
                            item={item}
                            selectedContinent={selectedContinent}
                            setSelectedContinent={setSelectedContinent}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsList}
                />
            </View>

            {/* Leagues Grid */}
            {isLeaguesLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                    <Text style={styles.loaderText}>{t('loading')}...</Text>
                </View>
            ) : (
                <FlatList
                    data={leagues}
                    renderItem={({ item }) => <LeagueCard item={item} />}
                    keyExtractor={item => item.id.toString()}
                    numColumns={isLG ? 4 : 2}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.columnWrapper}
                />
            )}
        </>
    );

    const renderRealContent = () => (
        <>
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
            {isPaidLeaguesLoading ? (
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
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={[
                styles.topBar,
                viewMode === 'real' && styles.topBarReal,
            ]}>
                {renderHomeLink()}

                {viewMode === 'real' ? (
                    <View style={styles.titleContainer}>
                        <Text style={styles.topBarTitle}>{t('select-league')}</Text>
                        <View style={styles.realModeBadge}>
                            <Ionicons name="cash" size={14} color={colors.background} />
                            <Text style={styles.realModeText}>{t('real-mode')}</Text>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.topBarTitle}>{t('select-league')}</Text>
                )}

                <View style={styles.coinsWrapper}>
                    {viewMode === 'free' ? (
                        <CoinsDisplay coins={isCoinsLoading ? '...' : (userCoins?.coins || 0)} />
                    ) : (
                        <View style={{ width: 40 }} />
                    )}
                </View>
            </View>

            {/* Main Content */}
            {renderModeToggle()}
            <View style={styles.content}>
                {viewMode === 'free' ? renderFreeContent() : renderRealContent()}
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
        borderBottomColor: colors.surfaceBorder,
    },
    topBarReal: {
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
    coinsWrapper: {
        minWidth: 80,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundInput,
        borderRadius: borderRadius.md,
        padding: 3,
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
    },
    toggleContainerLG: {
        alignSelf: 'center',
        width: 320,
        marginHorizontal: 'auto',
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        gap: spacing.xs,
    },
    toggleButtonLeft: {
        borderTopLeftRadius: borderRadius.sm,
        borderBottomLeftRadius: borderRadius.sm,
    },
    toggleButtonRight: {
        borderTopRightRadius: borderRadius.sm,
        borderBottomRightRadius: borderRadius.sm,
    },
    toggleButtonActiveFree: {
        backgroundColor: colors.accent,
        borderRadius: borderRadius.sm,
    },
    toggleButtonActiveReal: {
        backgroundColor: colors.coins,
        borderRadius: borderRadius.sm,
    },
    toggleButtonText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.labelMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    toggleButtonTextActive: {
        color: colors.background,
    },
    toggleButtonTextActiveReal: {
        color: colors.background,
    },
    content: {
        flex: 1,
        paddingTop: spacing.lg,
    },
    sectionHeader: {
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    tabsContainer: {
        marginBottom: spacing.lg,
        justifyContent: 'center',
    },
    tabsList: {
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
        flexGrow: 1,
        justifyContent: 'center',
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

export default LeagueSelectionScreen;