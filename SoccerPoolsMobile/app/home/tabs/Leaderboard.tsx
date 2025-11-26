import { useState, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { MAIN_COLOR } from '../../../constants';
import { Slug } from '../../../types';
import RankedPlayersFlatList from '../../../components/RankedPlayersFlatList';
import RoundsPicker from 'components/RoundPicker';
import { Banner } from 'components/ads/Ads';
import LoadingCards from '../../../components/LoadingCards';
import { getWrapper } from '../../../utils/getWrapper';
import { useUserLeague, useRounds } from '../../../hooks/useLeagues';
import { useBetLeaders } from '../../../hooks/useResults';

export default function Leaderboard() {
  const toast: ToastType = useToast();
  const Wrapper = getWrapper();

  const { data: league, isLoading: isLeagueLoading } = useUserLeague();
  const { data: rounds, isLoading: isRoundsLoading } = useRounds(league?.id);

  const [activeRoundId, setActiveRoundId] = useState<number | null>(null);

  // Set initial active round
  useEffect(() => {
    if (rounds && rounds.length > 0 && activeRoundId === null) {
      setActiveRoundId(rounds[0].id);
    }
  }, [rounds]);

  const activeRound = useMemo(() =>
    rounds?.find(round => round.id === activeRoundId),
    [rounds, activeRoundId]
  );

  const activeRoundSlug = activeRound?.slug;

  const { 
    data: betLeadersData, fetchNextPage, hasNextPage, isFetchingNextPage, 
    isLoading: isBetsLoading, refetch: refetchBets, isRefetching
  } = useBetLeaders(activeRoundSlug, 0);

  const bets = useMemo(() =>
    betLeadersData?.pages.flatMap(page => page.results) || [],
    [betLeadersData]
  );

  const handleRoundSwap = (roundId: number, roundSlug: Slug) => {
    setActiveRoundId(roundId);
  }

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  const isLoading = isLeagueLoading || isRoundsLoading || (isBetsLoading && !isRefetching);

  return (
    <Wrapper style={styles.container}>
      {
        (isLeagueLoading || isRoundsLoading)
        ?
        <ShimmerPlaceholder style={styles.roundsListLoading} />
        :
        <RoundsPicker
          rounds={rounds || []}
          handleRoundSwap={handleRoundSwap}
          activeRoundId={activeRoundId}
        />
      }

      {
        isLoading
        ? 
        <LoadingCards cardHeight={80} nCards={5} cardColor='#d9d9d9' />
        : 
        <RankedPlayersFlatList
          bets={bets}
          coinsPrizes={activeRound?.coins_prizes ?? null}
          onEnd={loadMore}
          loadingMore={isFetchingNextPage}
          refreshing={isRefetching}
          onRefresh={refetchBets}
        />
      }

      <Banner bannerId={process.env.LEADERBOARD_BANNER_ID} />
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: MAIN_COLOR, 
    flex: 1 
  },
  roundsListLoading: { 
    width: '100%', 
    height: 50, 
    marginBottom: 30 
  },
  leaguesContainer: { 
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingTop: 7, 
    backgroundColor: '#d9d9d9', 
    height: 50, 
    marginBottom: 15 
  },
  roundBtn: { 
    marginHorizontal: 15, 
    marginVertical: 0 
  },
  roundTxt: { 
    fontWeight: '700', 
    fontSize: 17 
  },
  activeRoundBtn: { 
    borderBottomColor: MAIN_COLOR, 
    borderBottomWidth: 5 
  },
  activeRoundTxt: { 
    color: MAIN_COLOR 
  },
  betResultsContainer: { 
    paddingBottom: 70, 
    flexGrow: 1 
  },
});