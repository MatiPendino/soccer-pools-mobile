import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"
import { useToast } from "react-native-toast-notifications";
import { getToken } from "../../../utils/storeToken";
import { matchResultsList, matchResultsUpdate } from "../../../services/matchService";
import MatchResult from "./MatchResult";


export default function Leaderboard ({rounds, setRoundsState, roundsState}) {
    const [matchResults, setMatchResults] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const toast = useToast()

    const getMatchResults = async (token, roundId) => {
        try {
            const matchResults = await matchResultsList(token, roundId)
            setMatchResults(matchResults)
        } catch (error) {
            toast.show('There´s been an error getting the matches', {type: 'danger'})
        }
    }

    const updateActiveRound = (roundSlug) => {
        const newRoundsState = Object.keys(roundsState).reduce((acc, key) => {
            acc[key] = key === roundSlug
            return acc
        }, {})
    
        setRoundsState(newRoundsState)
    }

    const savePredictions = async () => {
        try {
            const token = await getToken()
            //matchResultsUpdate(token, )
        } catch (error) {
            toast.show('There´s been an error saving the matches', {type: 'danger'})
        }
    }

    const swapRoundMatchResults = async (roundId, roundSlug) => {
        try {
            const token = await getToken()
            getMatchResults(token, roundId)  

            updateActiveRound(roundSlug)
        } catch (error) {
            toast.show('There´s been an error getting the matches', {type: 'danger'})
        } 
    }

    useEffect(() => {
        const getFirstMatchResults = async () => {
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
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.leaguesContainer}
            />
            <FlatList
                data={matchResults}
                renderItem={({item}) => (
                    <MatchResult matchResult={item} />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.matchResultsContainer}
                horizontal={false} 
                showsVerticalScrollIndicator={true}
            />

            <Pressable
                style={styles.saveBtn}
                onPress={() => {console.log('SAVE')}}
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
        width: '100%',
        paddingTop: 7,
        backgroundColor: '#d9d9d9',
        marginBottom: 15
    },
    roundBtn: {
        paddingBottom: 5
    },
    roundTxt: {
        fontWeight: '700',
        fontSize: 19
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