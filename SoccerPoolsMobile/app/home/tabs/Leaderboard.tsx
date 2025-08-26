import { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { MAIN_COLOR } from '../../../constants';
import { RoundProps, RoundsStateProps, BetProps, Slug, LeagueProps, CoinsPrizes } from '../../../types';
import { getToken } from '../../../utils/storeToken';
import RankedPlayersFlatList from '../../../components/RankedPlayersFlatList';
import { getRounds, getRoundsState, swapRoundsBetLeaders } from '../../../utils/leagueRounds';
import { getBetLeadersCursor } from '../../../services/betService';
import RoundsPicker from 'components/RoundPicker';
import { userLeague } from '../../../services/leagueService';
import { Banner } from 'components/ads/Ads';
import LoadingCards from '../../../components/LoadingCards';
import { getWrapper } from '../../../utils/getWrapper';

export default function Leaderboard () {
  const [rounds, setRounds] = useState<RoundProps[]>([]);
  const [roundsState, setRoundsState] = useState<RoundsStateProps>({});
  const [bets, setBets] = useState<BetProps[]>([]);
  const [coinsPrizes, setCoinsPrizes] = useState<CoinsPrizes>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const tokenRef = useRef<string>('');

  const toast = useToast();
  const Wrapper = getWrapper();

  const swapRoundBetLeaders = async (roundId: number, roundSlug: Slug) => {
    try {
      const { newRoundsState } = await swapRoundsBetLeaders(roundSlug, roundsState);
      setRoundsState(newRoundsState);

      // Reset list and fetch first page via cursor
      setBets([]);
      setNextUrl(null);
      setRefreshing(true);
      const page = await getBetLeadersCursor(tokenRef.current, roundSlug, 0, null);
      setBets(page.results);
      setNextUrl(page.next);

      const currentRound = rounds.find(round => round.id === roundId);
      setCoinsPrizes(currentRound?.coins_prizes ?? null);
    } catch (error) {
      toast.show('There`s been an error displaying the bets', {type: 'danger'});
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const getLeague = async (): Promise<void> => {
      try {
        const token: string = await getToken();
        tokenRef.current = token;

        const temp_league: LeagueProps = await userLeague(token);
        const roundsByLeague = await getRounds(token, temp_league.id);
        setRounds(roundsByLeague);
        setRoundsState(getRoundsState(roundsByLeague));
        setCoinsPrizes(roundsByLeague[0].coins_prizes);

        // First page via cursor
        const firstRoundSlug = roundsByLeague[0].slug;
        const page = await getBetLeadersCursor(token, firstRoundSlug, 0, null);
        console.log(page);
        setBets(page.results);
        setNextUrl(page.next);
      } catch (error) {
        toast.show('There is been an error displaying league information', {type: 'danger'});
      } finally {
        setIsLoading(false);
      }
    }

    getLeague();
  }, [])

  const loadMore = async () => {
    if (!nextUrl || loadingMore) return;
    setLoadingMore(true);

    try {
      const page = await getBetLeadersCursor(tokenRef.current, '', 0, nextUrl);
      console.log(page);
      setBets(prev => [...prev, ...page.results]);
      setNextUrl(page.next);
    } catch (e) {
      toast.show('There is been an error loading the rankings', {type: 'danger'});
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <Wrapper style={styles.container}>
      {
        isLoading
        ? 
        <ShimmerPlaceholder style={styles.roundsListLoading} />
        : 
        <RoundsPicker
          rounds={rounds}
          handleRoundSwap={swapRoundBetLeaders}
          roundsState={roundsState}
        />
      }

      {
        isLoading
        ? 
        <LoadingCards cardHeight={80} nCards={5} cardColor='#d9d9d9' />
        : 
        <RankedPlayersFlatList
          bets={bets}
          coinsPrizes={coinsPrizes}
          onEnd={loadMore}
          loadingMore={loadingMore}
          refreshing={refreshing}
          onRefresh={() => {
            // Pull to refresh current round
            const current = rounds.find(round => roundsState[round.id]);
            if (!current) return;
            swapRoundBetLeaders(current.id, current.slug);
          }}
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