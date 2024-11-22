import { useEffect, useState } from "react"
import { useToast } from "react-native-toast-notifications"
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native"
import { leagueList } from "../../services/leagueService"
import { getToken } from "../../utils/storeToken"
import LeagueCard from "./components/LeagueCard"
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"

export default function SelectLeague({}) {
    const toast = useToast()
    const [leagues, setLeagues] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getLeagueList = async () => {
            try {
                const token = await getToken()
                const leagues = await leagueList(token)
                setLeagues(leagues)
            } catch (error) {
                toast.error('Error authenticating user')
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        
        getLeagueList()
    }, [])

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <Text style={styles.selectLeagueTxt}>Select a League</Text>
            <FlatList
                data={leagues}
                renderItem={({ item }) => (
                    <LeagueCard
                        leagueImgUrl={item.logo}
                        leagueTitle={item.name}
                        leagueSlug={item.slug}
                    />
                )}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.leaguesContainer}
            />
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
        height: '100%',
        //flex: 1
    },
    selectLeagueTxt: {
        color: '#fff',
        fontSize: 26,
        marginTop: 60,
        textAlign: 'center',
        fontWeight: '600'
    },
    leaguesContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    }
})