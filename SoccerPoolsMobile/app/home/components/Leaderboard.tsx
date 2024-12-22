import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import { RoundProps, RoundsStateProps, BetProps, Slug } from "../../../types";
import { getToken } from "../../../utils/storeToken";
import { betsLeaders } from "../../../services/betService";
import RankedPlayer from "./RankedPlayer";

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

    const getBetLeaders = async (token: string, roundSlug: Slug): Promise<void> => {
        try {
            const betLeaders = await betsLeaders(token, roundSlug)
            setBets(betLeaders)
        } catch (error) {
            toast.show('There´s been an error getting the bets', {type: 'danger'})
        }
    }

    const updateActiveRound = (roundSlug: Slug): void => {
        const newRoundsState = Object.keys(roundsState).reduce((updatedRoundsState: RoundsStateProps, key) => {
            updatedRoundsState[key] = key === roundSlug
            return updatedRoundsState
        }, {} as RoundsStateProps)
    
        setRoundsState(newRoundsState)
    }

    const swapRoundBetLeaders = async (roundSlug: Slug): Promise<void> => {
        try {
            const token = await getToken()
            getBetLeaders(token, roundSlug)  
            updateActiveRound(roundSlug)
        } catch (error) {
            toast.show('There´s been an error getting the bets', {type: 'danger'})
        } 
    }

    useEffect(() => {
        const getFirstBetLeaders = async (): Promise<void> => {
            try {
                const token = await getToken()
                getBetLeaders(token, rounds[0].slug)  
            } catch (error) {
                toast.show('There´s been an error getting the matches', {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }
        getFirstBetLeaders()
        // TODO idea to add General option https://github.com/MatiPendino/soccer-pools-mobile/issues/1
        /* 
            For the results tab, we need a "General" round to display the points accumulated
            throughout the whole league
            Creation of General round and appended to the rounds list
        */
        /* 
            The slug for the general round equals to the slug of the first round of the list
            and general-no-repeat
        */
        /* const generalRoundSlug = `${rounds[0].slug}-general-no-repeat`
        const generalRound: RoundProps = {
            id: 0,
            league: rounds[0].league,
            name: 'General',
            number_round: 0,
            round_state: 0,
            slug: generalRoundSlug,
            start_date: '2020-07-10 15:00:00.000',
            end_date: '2020-07-10 15:00:00.000'
        }
        setRounds([generalRound, ...rounds])

        const getGeneralBetResults = async (): Promise<void> => {
            try {
                const token = await getToken()
                getBetResults(token, generalRoundSlug)  
            } catch (error) {
                toast.show('There´s been an error getting the bets', {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }
        getGeneralBetResults()*/
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
            <FlatList
                data={bets}
                renderItem={({item}) => (
                    <RankedPlayer 
                        index={1} 
                        username={item.username}
                        points={item.points}
                        profileImageUrl={item.profile_image}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.betResultsContainer}
                horizontal={false} 
                showsVerticalScrollIndicator={true}
            />
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