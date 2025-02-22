import { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastType, useToast } from "react-native-toast-notifications";
import { BetProps, RoundProps, RoundsStateProps, Slug } from "../../types";
import { Router, useLocalSearchParams } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import { Menu, PaperProvider } from 'react-native-paper';
import { useRouter } from "expo-router";
import { getToken } from "../../utils/storeToken";
import RankedPlayersFlatList from "../../components/RankedPlayersFlatList";
import { getBetLeaders, getRounds, getRoundsState, swapRoundsBetLeaders } from "../../utils/leagueRounds";
import handleShare from "../../utils/handleShare";
import { useTranslation } from "react-i18next";
import RoundsHorizontalList from "../../components/RoundsHorizontalList";
import { Banner, interstitial } from "../../components/Ads";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LoadingCards from "../../components/LoadingCards";

export default function MyTournament({}) {
    const { t } = useTranslation()
    const { tournamentName, tournamentId, leagueId, isAdmin } = useLocalSearchParams()
    const [bets, setBets] = useState<BetProps[]>(null)
    const [rounds, setRounds] = useState<RoundProps[]>([])
    const [roundsState, setRoundsState] = useState<RoundsStateProps>({})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false)
    const toast: ToastType = useToast()
    const router: Router = useRouter()

    //interstitial(process.env.MY_TOURNAMENT_INTERST_ID)

    useEffect(() => {
        const getFirstBetLeaders = async (): Promise<void> => {
            try {
                const token = await getToken()
                const roundsByLeague = await getRounds(token, leagueId)
                setRounds(roundsByLeague)
                setRoundsState(getRoundsState(roundsByLeague)) 
                if (roundsByLeague) {
                    const firstRoundSlug: Slug = roundsByLeague[0].slug
                    const betLeaders = await getBetLeaders(token, firstRoundSlug, Number(tournamentId)) 
                    setBets(betLeaders)  
                }
            } catch (error) {
                toast.show('There´s been an error getting the matches', {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }
        
        getFirstBetLeaders()
    }, [])

    const swapRoundBetLeaders = async (roundId: number, roundSlug: Slug) => {
        try {
            const {betLeaders, newRoundsState} = await swapRoundsBetLeaders(
                roundSlug, Number(tournamentId), roundsState
            )

            setBets(betLeaders)
            setRoundsState(newRoundsState)
        } catch (error) {
            toast.show('There`s been an error displaying the bets', {type: 'danger'})
        }
    }

    const handleTournamentClick = (pathname: string) => {
        router.push({
            pathname: pathname,
            params: {
                tournamentId: tournamentId
            }
        })
    }

    return (
        <PaperProvider>
            <GestureHandlerRootView style={styles.container}>
                <View style={styles.topBar}>
                    <View style={styles.arrowNameContainer}>
                        <Pressable onPress={() => router.replace('/home')}>
                            <Entypo name="chevron-left" color="white" size={30} />   
                        </Pressable>

                        <Text style={styles.tntNameTxt}>{tournamentName.toString().toUpperCase()}</Text>
                    </View>
                    
                    <View>
                        <Menu
                            visible={isMenuVisible}
                            onDismiss={() => setIsMenuVisible(false)}
                            anchor={
                                <Pressable onPress={() => setIsMenuVisible(true)}>
                                    <Entypo name="dots-three-vertical" color="white" size={30} />   
                                </Pressable>
                            }
                        >
                            <Menu.Item onPress={handleShare} title={t('invite-friends')} />
                            {
                                Boolean(isAdmin)
                                ?
                                <View>
                                    <Menu.Item 
                                        onPress={
                                            () => handleTournamentClick('pending-invites')
                                        } 
                                        title={t('pending-invites')}
                                    />
                                    <Menu.Item 
                                        onPress={
                                            () => handleTournamentClick('edit-tournament')
                                        } 
                                        title={t('tournament-settings')}
                                    />
                                </View>
                                :
                                <View></View>
                            }
                        </Menu>
                    </View>
                </View>

                {
                    isLoading
                    ?
                    <ShimmerPlaceholder style={styles.roundsListLoading} />
                    :
                    <RoundsHorizontalList
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
                        <RankedPlayersFlatList bets={bets} />
                        :
                        <View><Text style={styles.noBetsTxt}>{t('no-bets')}</Text></View>
                }

                <Banner bannerId={process.env.MY_TOURNAMENT_BANNER_ID} />
            </GestureHandlerRootView>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
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
        marginTop: 20,
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
        color: '#6860A1',
        borderBottomColor: '#6860A1',
        borderBottomWidth: 5,
    },
})