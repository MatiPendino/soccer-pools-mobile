import { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import RoundsPicker from 'components/RoundPicker';
import { Banner } from 'components/ads/Ads';
import { Slug } from '../../../types';
import RankedPlayersFlatList from '../../../components/RankedPlayersFlatList';
import { getWrapper } from '../../../utils/getWrapper';
import { useUserLeague, useRounds } from '../../../hooks/useLeagues';
import { useBetLeaders } from '../../../hooks/useResults';
import { colors, spacing } from '../../../theme';

export default function Leaderboard() {
    const Wrapper = getWrapper();

    const { data: league, isLoading: isLeagueLoading } = useUserLeague();
    const { data: rounds, isLoading: isRoundsLoading } = useRounds(league?.id);

    const [activeRoundId, setActiveRoundId] = useState<number | null>(null);

    useEffect(() => {
        if (rounds && rounds.length > 0 && activeRoundId === null) {
            setActiveRoundId(rounds[0].id);
        }
    }, [rounds]);

    const activeRound = useMemo(
        () => rounds?.find((round) => round.id === activeRoundId),
        [rounds, activeRoundId]
    );

    const activeRoundSlug = activeRound?.slug;

    const {
        data: betLeadersData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isBetsLoading,
        refetch: refetchBets,
        isRefetching,
    } = useBetLeaders(activeRoundSlug, 0);

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

    const isLoading: boolean = isLeagueLoading || isRoundsLoading || (isBetsLoading && !isRefetching);

    return (
        <Wrapper style={styles.container}>
            {isLeagueLoading || isRoundsLoading ? (
                <ShimmerPlaceholder style={styles.roundsListLoading} />
            ) : (
                <RoundsPicker
                    rounds={rounds || []}
                    handleRoundSwap={handleRoundSwap}
                    activeRoundId={activeRoundId}
                />
            )}

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
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

            <Banner bannerId={process.env.LEADERBOARD_BANNER_ID} />
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
});