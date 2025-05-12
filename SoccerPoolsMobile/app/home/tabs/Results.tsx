import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Pressable, StyleSheet, ActivityIndicator, AppState } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"
import { ToastType, useToast } from "react-native-toast-notifications";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { MAIN_COLOR } from "../../../constants";
import { getToken } from "../../../utils/storeToken";
import { matchResultsList, matchResultsUpdate } from "../../../services/matchService";
import MatchResult from "../components/MatchResult";
import { LeagueProps, MatchResultProps, RoundProps, RoundsStateProps, Slug } from "../../../types";
import { getRounds, getRoundsState, updateActiveRound } from "../../../utils/leagueRounds";
import { useTranslation } from "react-i18next";
import RoundsHorizontalList from "../../../components/RoundsHorizontalList";
import { userLeague } from "../../../services/leagueService";
import { getNextRoundId } from "../../../utils/getNextRound";
import handleError from "../../../utils/handleError";
import { registerPush, getFCMToken } from "../../../services/pushNotificationService";
import { showOpenAppAd } from "../../../components/Ads";


export default function Results ({}) {
    const { t } = useTranslation()
    const [rounds, setRounds] = useState<RoundProps[]>([])
    const [roundsState, setRoundsState] = useState<RoundsStateProps>({})
    const [matchResults, setMatchResults] = useState<MatchResultProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isRoundLoading, setIsRoundLoading] = useState<boolean>(false)
    const [isSavePredLoading, setIsSavePredLoading] = useState<boolean>(false)
    const toast: ToastType = useToast()

    const getMatchResults = async (token: string, roundId: number): Promise<void> => {
        setIsRoundLoading(true)
        try {
            const matchResults = await matchResultsList(token, roundId)
            setMatchResults(matchResults)
        } catch (error) {
            toast.show('There´s been an error getting the matches', {type: 'danger'})
        } finally {
            setIsRoundLoading(false)
        }
    }

    const savePredictions = async (): Promise<void> => {
        setIsSavePredLoading(true)
        try {
            const token = await getToken()
            const response = await matchResultsUpdate(token, matchResults)
            toast.show(t('matches-saved-successfully'), {type: 'success'})
        } catch (error) {
            toast.show(handleError(error), {type: 'danger'})
        } finally {
            setIsSavePredLoading(false)
        }
    }

    const swapRoundMatchResults = async (roundId: number, roundSlug: Slug): Promise<void> => {
        try {
            const token = await getToken()
            getMatchResults(token, roundId)  
            setRoundsState(updateActiveRound(roundSlug, roundsState))
        } catch (error) {
            toast.show('There´s been an error getting the matches', {type: 'danger'})
        } 
    }

    useEffect(() => {
        const getLeague = async (): Promise<void> => {
            try {
                const token: string = await getToken()
                const temp_league: LeagueProps = await userLeague(token)
                const roundsByLeague = await getRounds(token, temp_league.id, true)
                const nextRoundId = getNextRoundId(roundsByLeague)

                setRounds(roundsByLeague)
                setRoundsState(getRoundsState(roundsByLeague, nextRoundId))
                getFirstMatchResults(token, nextRoundId)
            } catch (error) {
                toast.show('There is been an error displaying league information', {type: 'danger'})
            } 
        }

        const getFirstMatchResults = async (token, firstRoundId): Promise<void> => {
            try {
                getMatchResults(token, firstRoundId)  
            } catch (error) {
                toast.show('There´s been an error getting the matches', {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }

        const sendFCMToken = async () => {
            try {
                const existingFCMToken = await AsyncStorage.getItem('FCMToken')
                if (!existingFCMToken) {
                    const token = await getToken()
                    const fcmToken = await getFCMToken()
                    const response = registerPush(token, fcmToken)    
                    if (response) {
                        await AsyncStorage.setItem('FCMToken', fcmToken)
                    }
                }
            } catch (error) {
                Sentry.captureException(error)
            }
        }

        getLeague()
        sendFCMToken()
    }, [])

    useEffect(() => {
        try {
            showOpenAppAd(process.env.OPEN_AD_APP_ID)
        } catch (error) {
            Sentry.captureException(error)
        }
    }, [])

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            {
                isLoading
                ?
                <ShimmerPlaceholder style={styles.roundsListLoading} />
                :
                <RoundsHorizontalList
                    rounds={rounds}
                    handleRoundSwap={swapRoundMatchResults}
                    roundsState={roundsState}
                    isResultsTab={true}
                />
            }

            {
                isRoundLoading
                ?
                    <ActivityIndicator style={{paddingBottom: 250}} size="large" color="#fff" />
                :
                <FlatList
                    data={matchResults}
                    renderItem={({item}) => (
                        <MatchResult 
                            currentMatchResult={item} 
                            matchResults={matchResults} 
                            setMatchResults={setMatchResults} 
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.matchResultsContainer}
                    horizontal={false} 
                    showsVerticalScrollIndicator={true}
                />
            }

            <Pressable
                style={styles.saveBtn}
                onPress={
                    () => !isSavePredLoading ? savePredictions() : {}
                }
            >
                {
                    isSavePredLoading
                    ?
                    <ActivityIndicator color='#fff' size='small' />
                    :
                    <Text style={styles.saveTxt}>{t('save-predictions')}</Text>
                }
            </Pressable>
        </GestureHandlerRootView>
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
        borderBottomWidth: 5,
    },
    activeRoundTxt: {
        color: MAIN_COLOR
    },
    matchResultsContainer: {
        paddingBottom: 70,
        flexGrow: 1
    },
    saveBtn: {
        width: '100%',
        backgroundColor: '#2F2766',
        paddingVertical: 20,
        position: 'absolute',
        left: 0,
        bottom: 0
    },
    saveTxt: {
        textAlign: 'center',
        fontWeight: "600",
        color: 'white',
        fontSize: 18
    }
})