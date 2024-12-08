import { useEffect, useState } from "react";
import { Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"
import { useToast } from "react-native-toast-notifications";
import { getToken } from "../../../utils/storeToken";
import { matchResultsList, matchResultsUpdate } from "../../../services/matchService";
import MatchResult from "./MatchResult";
import { MatchResultProps, RoundProps, RoundsStateProps, Slug } from "../../../types";

interface LeaderboardProps {
    rounds: RoundProps[]
    setRoundsState: React.Dispatch<React.SetStateAction<RoundsStateProps>>
    roundsState: RoundsStateProps
}

export default function Leaderboard ({rounds, setRoundsState, roundsState}: LeaderboardProps) {
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

    const updateActiveRound = (roundSlug: Slug): void => {
        const newRoundsState = Object.keys(roundsState).reduce((updatedRoundsState: RoundsStateProps, key) => {
            updatedRoundsState[key] = key === roundSlug
            return updatedRoundsState
        }, {} as RoundsStateProps)
    
        setRoundsState(newRoundsState)
    }

    const savePredictions = async (): Promise<void> => {
        try {
            const token = await getToken()
            const response = await matchResultsUpdate(token, matchResults)
        } catch (error) {
            toast.show('There´s been an error saving the matches', {type: 'danger'})
        }
    }

    const swapRoundMatchResults = async (roundId: number, roundSlug: Slug): Promise<void> => {
        try {
            const token = await getToken()
            getMatchResults(token, roundId)  
            updateActiveRound(roundSlug)
        } catch (error) {
            toast.show('There´s been an error getting the matches', {type: 'danger'})
        } 
    }

    useEffect(() => {
        const getFirstMatchResults = async (): Promise<void> => {
            try {
                const token = await getToken()
                getMatchResults(token, rounds[0].id)  
            } catch (error) {
                toast.show('There´s been an error getting the matches', {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }
        getFirstMatchResults()
    }, [])

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <FlatList
                data={rounds}
                renderItem={({item}) => (
                    <Pressable 
                        onPress={() => swapRoundMatchResults(item.id, item.slug)}
                        style={[styles.roundBtn, roundsState[item.slug] ? styles.activeRoundBtn : '' ]}
                    >
                        <Text style={[styles.roundTxt, roundsState[item.slug] ? styles.activeRoundTxt : '']}>
                            {item.name.toUpperCase()}
                        </Text>
                    </Pressable>
                )}
                horizontal={true}
                keyExtractor={(item) => item.slug}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.leaguesContainer}
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
                <Text style={styles.saveTxt}>SAVE PREDICTIONS</Text>
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
        flex: 1,
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