import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import { RoundProps, RoundsStateProps, BetProps, Slug } from "../../../types";
import { getToken } from "../../../utils/storeToken";
import RankedPlayersFlatList from "../../../components/RankedPlayersFlatList";
import { getBetLeaders, swapRoundsBetLeaders } from "../../../utils/leagueRounds";

interface LeaderboardProps {
    rounds: RoundProps[]
    setRounds: React.Dispatch<React.SetStateAction<RoundProps[]>>
    setRoundsState: React.Dispatch<React.SetStateAction<RoundsStateProps>>
    roundsState: RoundsStateProps
}

export default function Leaderboard ({rounds, setRounds, setRoundsState, roundsState}: LeaderboardProps) {
    const [bets, setBets] = useState<BetProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const toast = useToast()

    const swapRoundBetLeaders = async (roundSlug: Slug) => {
        try {
            const {betLeaders, newRoundsState} = await swapRoundsBetLeaders(
                roundSlug, 0, roundsState
            )

            setBets(betLeaders)
            setRoundsState(newRoundsState)
        } catch (error) {
            console.log(error)
            toast.show('There`s been an error displaying the bets', {type: 'danger'})
        }
    }

    useEffect(() => {
        const getFirstBetLeaders = async (): Promise<void> => {
            try {
                const token = await getToken()
                const betLeaders = await getBetLeaders(token, rounds[0].slug, 0)  
                setBets(betLeaders)
            } catch (error) {
                toast.show('There´s been an error getting the matches', {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }
        getFirstBetLeaders()
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
                        onPress={() => swapRoundBetLeaders(item.slug)}
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
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.leaguesContainer}
            />
            <RankedPlayersFlatList bets={bets} />
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
    betResultsContainer: {
        paddingBottom: 70,
        flexGrow: 1
    },
})