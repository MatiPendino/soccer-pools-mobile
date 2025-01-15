import { useEffect, useState } from "react"
import { useToast } from "react-native-toast-notifications"
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native"
import { leagueList } from "../../services/leagueService"
import { getToken } from "../../utils/storeToken"
import LeagueCard from "./components/LeagueCard"
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"
import { LeagueProps } from "../../types"
import { useTranslation } from "react-i18next"

export default function SelectLeague({}) {
    const { t } = useTranslation()
    const toast = useToast()
    const [leagues, setLeagues] = useState<LeagueProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const getLeagueList = async (): Promise<void> => {
            try {
                const token = await getToken()
                const leagues = await leagueList(token)
                setLeagues(leagues)
            } catch (error) {
                toast.show('Error authenticating user', {type: 'danger'})
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
            <Text style={styles.selectLeagueTxt}>{t('select-league')}</Text>
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
                keyExtractor={(item) => item.slug}
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