import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import { RoundProps, RoundsStateProps, BetProps, Slug, LeagueProps } from "../../../types";
import { getToken } from "../../../utils/storeToken";
import RankedPlayersFlatList from "../../../components/RankedPlayersFlatList";
import { getBetLeaders, getRounds, getRoundsState, swapRoundsBetLeaders } from "../../../utils/leagueRounds";
import RoundsHorizontalList from "../../../components/RoundsHorizontalList";
import { userLeague } from "../../../services/leagueService";

export default function Leaderboard ({}) {
    const [rounds, setRounds] = useState<RoundProps[]>([])
    const [roundsState, setRoundsState] = useState<RoundsStateProps>({})
    const [bets, setBets] = useState<BetProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const toast = useToast()

    const swapRoundBetLeaders = async (roundId: number, roundSlug: Slug) => {
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
        const getLeague = async (): Promise<void> => {
            try {
                const token: string = await getToken()
                const temp_league: LeagueProps = await userLeague(token)
                const roundsByLeague = await getRounds(token, temp_league.id)
                setRounds(roundsByLeague)
                setRoundsState(getRoundsState(roundsByLeague))

                getFirstBetLeaders(token, roundsByLeague[0].slug)
            } catch (error) {
                console.log(error)
                toast.show('There is been an error displaying league information', {type: 'danger'})
            } 
        }

        const getFirstBetLeaders = async (token, firstRoundSlug): Promise<void> => {
            try {
                const betLeaders = await getBetLeaders(token, firstRoundSlug, 0)  
                setBets(betLeaders)
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
                handleRoundSwap={swapRoundBetLeaders}
                roundsState={roundsState}
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