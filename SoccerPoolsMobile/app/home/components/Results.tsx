import { useEffect, useState } from "react";
import { Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"
import { useToast } from "react-native-toast-notifications";
import { getToken } from "../../../utils/storeToken";
import { matchResultsList, matchResultsUpdate } from "../../../services/matchService";
import MatchResult from "./MatchResult";
import { LeagueProps, MatchResultProps, RoundProps, RoundsStateProps, Slug } from "../../../types";
import { getRounds, getRoundsState, updateActiveRound } from "../../../utils/leagueRounds";
import { useTranslation } from "react-i18next";
import RoundsHorizontalList from "../../../components/RoundsHorizontalList";
import { userLeague } from "../../../services/leagueService";


export default function Results ({}) {
    const { t } = useTranslation()
    const [rounds, setRounds] = useState<RoundProps[]>([])
    const [roundsState, setRoundsState] = useState<RoundsStateProps>({})
    const [matchResults, setMatchResults] = useState<MatchResultProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const toast = useToast()

    const getMatchResults = async (token: string, roundId: number): Promise<void> => {
        try {
            const matchResults = await matchResultsList(token, roundId)
            setMatchResults(matchResults)
        } catch (error) {
            toast.show('There´s been an error getting the matches', {type: 'danger'})
        }
    }

    const savePredictions = async (): Promise<void> => {
        try {
            const token = await getToken()
            const response = await matchResultsUpdate(token, matchResults)
            toast.show(t('matches-saved-successfully'), {type: 'success'})
        } catch (error) {
            toast.show('There´s been an error saving the matches', {type: 'danger'})
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
                setRounds(roundsByLeague)
                setRoundsState(getRoundsState(roundsByLeague))

                getFirstMatchResults(token, roundsByLeague[0].id)
            } catch (error) {
                console.log(error)
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

        getLeague()
    }, [])

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <RoundsHorizontalList
                rounds={rounds}
                handleRoundSwap={swapRoundMatchResults}
                roundsState={roundsState}
            />
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

            <Pressable
                style={styles.saveBtn}
                onPress={() => savePredictions()}
            >
                <Text style={styles.saveTxt}>{t('save-predictions')}</Text>
            </Pressable>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
        flex: 1
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
        borderBottomColor: '#6860A1',
        borderBottomWidth: 5,
    },
    activeRoundTxt: {
        color: '#6860A1'
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