import { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { FlatList, GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { ToastType, useToast } from "react-native-toast-notifications";
import { BetProps, LeagueProps, RoundProps, RoundsStateProps, Slug } from "../../types";
import { Router, useLocalSearchParams } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import { Menu, Divider, Button, PaperProvider } from 'react-native-paper';
import { useRouter } from "expo-router";
import { getToken } from "../../utils/storeToken";
import RankedPlayersFlatList from "../../components/RankedPlayersFlatList";
import { getBetLeaders, getRounds, getRoundsState, swapRoundsBetLeaders } from "../../utils/leagueRounds";
import handleShare from "../../utils/handleShare";


export default function MyTournament({}) {
    const { tournamentName, tournamentId, leagueId, isAdmin } = useLocalSearchParams()
    const [bets, setBets] = useState<BetProps[]>(null)
    const [rounds, setRounds] = useState<RoundProps[]>([])
    const [roundsState, setRoundsState] = useState<RoundsStateProps>({})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false)
    const toast: ToastType = useToast()
    const router: Router = useRouter()

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

    const swapRoundBetLeaders = async (roundSlug: Slug) => {
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

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />
    }
    return (
        <PaperProvider>
            <GestureHandlerRootView style={styles.container}>
                <View style={styles.topBar}>
                    <View style={styles.arrowNameContainer}>
                        <Pressable onPress={() => router.replace('home')}>
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
                            <Menu.Item onPress={handleShare} title="Invite Friends" />
                            {
                                Boolean(isAdmin)
                                ?
                                <View>
                                    <Menu.Item onPress={() => handleTournamentClick('pending-invites')} title="Pending Invites" />
                                    <Menu.Item onPress={() => handleTournamentClick('edit-tournament')} title="Tournament Settings" />
                                </View>
                                :
                                <View></View>
                            }
                        </Menu>
                    </View>
                </View>

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
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
        flex: 1
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