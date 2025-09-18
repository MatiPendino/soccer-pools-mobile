import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { ToastType, useToast } from "react-native-toast-notifications";
import { BetProps, RoundProps, RoundsStateProps, Slug } from "../../types";
import { Router, useLocalSearchParams } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import { PaperProvider } from 'react-native-paper';
import { useRouter } from "expo-router";
import { MAIN_COLOR } from "../../constants";
import { getToken } from "../../utils/storeToken";
import RankedPlayersFlatList from "../../components/RankedPlayersFlatList";
import { getRounds, getRoundsState, swapRoundsBetLeaders } from "../../utils/leagueRounds";
import handleShare from "../../utils/handleShare";
import { useTranslation } from "react-i18next";
import { TournamentProps } from "../../types";
import RoundsPicker from 'components/RoundPicker';
import { Banner, interstitial } from "components/ads/Ads";
import { getBetLeadersCursor } from "services/betService";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LoadingCards from "../../components/LoadingCards";
import { retrieveTournament } from "../../services/tournamentService";
import handleError from "../../utils/handleError";
import { getWrapper } from "../../utils/getWrapper";
import { useBreakpoint } from '../../hooks/useBreakpoint';
import MenuWeb from "./components/MenuWeb";
import MenuMobile from "./components/MenuMobile";

export default function MyTournament({}) {
    const { t } = useTranslation()
    const { tournamentId } = useLocalSearchParams()
    const [tournament, setTournament] = useState<TournamentProps>(null)
    const [bets, setBets] = useState<BetProps[]>(null)
    const [rounds, setRounds] = useState<RoundProps[]>([])
    const [roundsState, setRoundsState] = useState<RoundsStateProps>({})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false)

    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const tokenRef = useRef<string>('');

    const { isXL } = useBreakpoint();
    const toast: ToastType = useToast()
    const router: Router = useRouter()

    //interstitial(process.env.MY_TOURNAMENT_INTERST_ID)

    useEffect(() => {
        const getTournament = async (): Promise<void> => {
            try {
                const token: string = await getToken();
                if (!token) {
                    router.replace('/login')
                    return
                }
                tokenRef.current = token;
                const myTnt = await retrieveTournament(token, Number(tournamentId))
                if (!myTnt) {
                    toast.show('There is been an error getting the tournament', {type: 'danger'})
                    router.replace('/home')
                    return;
                } 
                setTournament(myTnt)

                const roundsByLeague = await getRounds(token, myTnt.league.id);
                setRounds(roundsByLeague);
                setRoundsState(getRoundsState(roundsByLeague));

                // First page via cursor
                const firstRoundSlug = roundsByLeague[0].slug;
                const page = await getBetLeadersCursor(token, firstRoundSlug,  Number(tournamentId), null);
                setBets(page.results);
                setNextUrl(page.next);
            } catch (error) {
                toast.show(handleError(error), {type: 'danger'})
                router.replace('/home')
            } finally {
                setIsLoading(false);
            }
        }
        
        getTournament()
    }, [])

    const swapRoundBetLeaders = async (roundId: number, roundSlug: Slug) => {
        try {
            const {newRoundsState} = await swapRoundsBetLeaders(roundSlug, roundsState);
            setRoundsState(newRoundsState);

            // Reset list and fetch first page via cursor
            setBets([]);
            setNextUrl(null);
            setRefreshing(true);
            const page = await getBetLeadersCursor(tokenRef.current, roundSlug, Number(tournamentId), null);
            setBets(page.results);
            setNextUrl(page.next);
        } catch (error) {
            toast.show('There`s been an error displaying the bets', {type: 'danger'})
        }
    }

    const loadMore = async () => {
        if (!nextUrl || loadingMore) return;
        setLoadingMore(true);
    
        try {
          const page = await getBetLeadersCursor(tokenRef.current, '', 0, nextUrl);
          setBets(prev => [...prev, ...page.results]);
          setNextUrl(page.next);
        } catch (e) {
          toast.show('There is been an error loading the rankings', {type: 'danger'});
        } finally {
          setLoadingMore(false);
        }
      }

    const handleTournamentClick = (pathname: string) => {
        router.push(`${pathname}/${tournamentId}/`)
    }

    const Wrapper = getWrapper();

    return (
        <PaperProvider>
            <Wrapper style={styles.container}>
                <View style={styles.topBar}>
                    <View style={styles.arrowNameContainer}>
                        <Pressable onPress={() => router.replace('/home')}>
                            <Entypo name="chevron-left" color="white" size={30} />   
                        </Pressable>

                        <Text style={styles.tntNameTxt}>
                            {tournament ? tournament.name.toUpperCase() : '...'}
                        </Text>
                    </View>
                    
                    {tournament &&
                        !isXL
                        ?
                        <MenuMobile
                            tournament={tournament}
                            t={t}
                            handleTournamentClick={handleTournamentClick}
                            isMenuVisible={isMenuVisible}
                            setIsMenuVisible={setIsMenuVisible}
                            handleShare={handleShare}
                        />
                        :
                        <MenuWeb
                            tournament={tournament}
                            t={t}
                            handleTournamentClick={handleTournamentClick}
                            handleShare={handleShare}
                        />
                    }
                </View>

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
                        bets.length > 0
                        ?
                        <RankedPlayersFlatList
                            bets={bets}
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
                        :
                        <View><Text style={styles.noBetsTxt}>{t('no-bets')}</Text></View>
                }

                <Banner bannerId={process.env.MY_TOURNAMENT_BANNER_ID} />
            </Wrapper>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAIN_COLOR,
        flex: 1
    },
    roundsListLoading: { 
        width: "100%", 
        height: 50, 
        marginBottom: 30 
    },
    topBar: {
        backgroundColor: '#2F2766',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        marginTop: Platform.OS === 'web' ? 0 : 20,
        paddingHorizontal: 5
    },
    arrowNameContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    tntNameTxt: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        marginStart: 5
    },
    noBetsTxt: {
        fontSize: 27,
        textAlign: 'center',
        color: 'white',
        fontWeight: '500',
        marginBottom: 250
    },
    leaguesContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 7,
        backgroundColor: '#d9d9d9',
        height: 40,
        marginBottom: 15
    },
    roundBtn: {
        marginHorizontal: 15,
        marginVertical: 0,
    },
    roundTxt: {
        fontWeight: '700',
        fontSize: 17
    },
    activeRoundBtn: {
    },
    activeRoundTxt: {
        color: MAIN_COLOR,
        borderBottomColor: MAIN_COLOR,
        borderBottomWidth: 5,
    },
})