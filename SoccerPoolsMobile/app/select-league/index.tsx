import { useEffect, useState } from "react"
import { useToast } from "react-native-toast-notifications"
import { StyleSheet, Text, ActivityIndicator } from "react-native"
import { leagueList } from "../../services/leagueService"
import { getToken } from "../../utils/storeToken"
import LeagueCard from "./components/LeagueCard"
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"
import { LeagueProps } from "../../types"
import { useTranslation } from "react-i18next"
import { Banner } from "../../components/Ads"

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
            } finally {
                setIsLoading(false)
            }
        }
        
        getLeagueList()
    }, [])

    return (
        <GestureHandlerRootView style={styles.container}>
            <Text style={styles.selectLeagueTxt}>{t('select-league')}</Text>
            {
                isLoading
                ?
                <ActivityIndicator size="large" color="white" />
                :
                <FlatList
                    data={leagues}
                    renderItem={({ item }) => (
                        <LeagueCard
                            leagueImgUrl={item.logo}
                            leagueTitle={item.name}
                            leagueSlug={item.slug}
                            isUserJoined={item.is_user_joined}
                            setIsLoading={setIsLoading}
                        />
                    )}
                    numColumns={2}
                    keyExtractor={(item) => item.slug}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.leaguesContainer}
                />
            }

            <Banner bannerId={process.env.SELECT_LEAGUE_BANNER_ID} />
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
        height: '100%',
    },
    selectLeagueTxt: {
        color: '#fff',
        fontSize: 26,
        marginTop: 60,
        textAlign: 'center',
        fontWeight: '600'
    },
    leaguesContainer: {
        marginHorizontal: 'auto'
    }
})