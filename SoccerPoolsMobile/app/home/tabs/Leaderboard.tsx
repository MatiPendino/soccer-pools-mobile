import { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import RoundsPicker from 'components/RoundPicker';
import { Banner } from 'components/ads/Ads';
import { Slug } from '../../../types';
import RankedPlayersFlatList from '../../../components/RankedPlayersFlatList';
import { getWrapper } from '../../../utils/getWrapper';
import { getNextRoundId } from '../../../utils/getNextRound';
import { useUserLeague, useRounds } from '../../../hooks/useLeagues';
import { useBetLeaders } from '../../../hooks/useResults';
import { usePaidRoundLeaderboard, useRoundPrizePool } from '../../../hooks/usePayment';
import { useGameMode } from '../../../contexts/GameModeContext';
import { colors, spacing, typography, borderRadius } from '../../../theme';

export default function Leaderboard() {
    const Wrapper = getWrapper();
    const { t } = useTranslation();
    const { isRealMode, selectedPaidLeague } = useGameMode();
    const { data: freeLeague, isLoading: isFreeLeagueLoading } = useUserLeague();

    // Determine which league to use based on mode
    const league = isRealMode && selectedPaidLeague ? selectedPaidLeague.league : freeLeague;
    const isLeagueLoading = isRealMode ? false : isFreeLeagueLoading;

    const { data: rounds, isLoading: isRoundsLoading } = useRounds(league?.id);

    // Filter rounds based on start_round_number in REAL mode (excludes General round)
    const filteredRounds = useMemo(() => {
        if (!rounds) return [];
        if (!isRealMode || !selectedPaidLeague) return rounds;

        const startRoundNumber = selectedPaidLeague.start_round_number || 1;
        return rounds.filter((round) =>
            round.number_round >= startRoundNumber
        );
    }, [rounds, isRealMode, selectedPaidLeague]);

    const [activeRoundId, setActiveRoundId] = useState<number | null>(null);

    useEffect(() => {
        if (filteredRounds && filteredRounds.length > 0 && activeRoundId === null) {
            // Default to the latest/most relevant round (same logic as Results page)
            setActiveRoundId(getNextRoundId(filteredRounds));
        }
    }, [filteredRounds]);

    const activeRound = useMemo(
        () => filteredRounds?.find((round) => round.id === activeRoundId),
        [filteredRounds, activeRoundId]
    );

    const activeRoundSlug = activeRound?.slug;

    // Free mode leaderboard
    const {
        data: betLeadersData, fetchNextPage, hasNextPage, isFetchingNextPage,
        isLoading: isBetsLoading, refetch: refetchBets, isRefetching,
    } = useBetLeaders(activeRoundSlug, 0);

    // REAL mode round leaderboard (no General round)
    const { data: paidLeaderboard, isLoading: isPaidLeaderboardLoading } = usePaidRoundLeaderboard(
        isRealMode && activeRoundSlug ? activeRoundSlug : ''
    );

    const { data: prizePool } = useRoundPrizePool(
        isRealMode && activeRoundSlug ? activeRoundSlug : ''
    );

    const bets = useMemo(
        () => betLeadersData?.pages.flatMap((page) => page.results) || [],
        [betLeadersData]
    );

    const handleRoundSwap = (roundId: number, roundSlug: Slug) => {
        setActiveRoundId(roundId);
    };

    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const isLoading: boolean = isLeagueLoading || isRoundsLoading ||
        (isRealMode ? isPaidLeaderboardLoading : (isBetsLoading && !isRefetching));

    return (
        <Wrapper style={styles.container}>
            {isLeagueLoading || isRoundsLoading ? (
                <ShimmerPlaceholder style={styles.roundsListLoading} />
            ) : (
                <RoundsPicker
                    rounds={filteredRounds}
                    handleRoundSwap={handleRoundSwap}
                    activeRoundId={activeRoundId}
                    isRealMode={isRealMode}
                    roundPriceArs={selectedPaidLeague?.round_price_ars}
                />
            )}

            {/* Prize Pool Banner for REAL mode */}
            {isRealMode && prizePool && (
                <View style={styles.prizePoolBanner}>
                    <Ionicons name="trophy" size={20} color={colors.coins} />
                    <Text style={styles.prizePoolText}>
                        {t('prize-pool-ars', { amount: prizePool.total_pool_ars })}
                    </Text>
                    <Text style={styles.participantsText}>
                        {prizePool.participants_count} {t('participants')}
                    </Text>
                </View>
            )}

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator 
                        size="large" 
                        color={isRealMode ? colors.coins : colors.accent} 
                    />
                </View>
            ) : isRealMode ? (
                <RankedPlayersFlatList
                    bets={paidLeaderboard || []}
                    coinsPrizes={null}
                    onEnd={() => {}}
                    loadingMore={false}
                    refreshing={false}
                    onRefresh={() => {}}
                    isPaidMode={true}
                    prizePoolTotal={prizePool?.total_pool_ars}
                />
            ) : (
                <RankedPlayersFlatList
                    bets={bets}
                    coinsPrizes={activeRound?.coins_prizes ?? null}
                    onEnd={loadMore}
                    loadingMore={isFetchingNextPage}
                    refreshing={isRefetching}
                    onRefresh={refetchBets}
                />
            )}

            {!isRealMode && <Banner bannerId={process.env.LEADERBOARD_BANNER_ID} />}
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    roundsListLoading: {
        width: '100%',
        height: 50,
        marginBottom: spacing.lg,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    prizePoolBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.coinsBg,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.coins,
        gap: spacing.sm,
    },
    prizePoolText: {
        color: colors.coins,
        fontSize: typography.fontSize.titleSmall,
        fontWeight: typography.fontWeight.bold,
    },
    participantsText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodySmall,
    },
});