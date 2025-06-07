import { Router, useLocalSearchParams } from "expo-router"
import { StyleSheet, View, Text, Pressable } from "react-native"
import { Entypo } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ToastType, useToast } from "react-native-toast-notifications"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { ActivityIndicator } from "react-native-paper"
import { MAIN_COLOR } from "../../constants"
import { getToken } from "../../utils/storeToken"
import { listPendingTournamentUsers } from "../../services/tournamentService"
import { TournamentUserProps } from "../../types"
import PendingInviteCard from "./components/PendingInviteCard"
import { useTranslation } from "react-i18next"
import { getWrapper } from "../../utils/getWrapper"
import { Banner } from "components/ads/Ads"

export default function PendingInvites () {
    const { t } = useTranslation()
    const { tournamentId } = useLocalSearchParams()
    const [pendingTournamentUsers, setPendingTournamentUsers] = useState<TournamentUserProps[]>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [token, setToken] = useState<string>('')
    const router: Router = useRouter()
    const toast: ToastType = useToast()

    useEffect(() => {
        const getPendingInvites = async () => {
            try {
                const tempToken = await getToken()
                const users = await listPendingTournamentUsers(tempToken, tournamentId)
                setToken(tempToken)
                setPendingTournamentUsers(users)
            } catch (error) {
                toast.show('There is been an error retrieving the pending users', {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }

        getPendingInvites()
    }, [])

    const Wrapper = getWrapper();

    return (
        <Wrapper style={styles.container}>
            <View style={styles.topBar}>
                <Pressable onPress={() => router.back()}>
                    <Entypo name="chevron-left" color="white" size={30} />
                </Pressable>
                <Text style={styles.topBarTxt}>{t('pending-invites')}</Text>
            </View>

            {
                isLoading
                ?
                    <ActivityIndicator size="large" color="#0000ff" />
                :
                    pendingTournamentUsers.length > 0
                    ?
                        <ScrollView 
                            contentContainerStyle={styles.invitesContainer} 
                            showsVerticalScrollIndicator={true}
                        >
                            {pendingTournamentUsers.map((pendingUser) => (
                                <PendingInviteCard
                                    key={pendingUser.id}
                                    id={pendingUser.id}
                                    token={token}
                                    username={pendingUser.user.username}
                                    userLogoUrl={pendingUser.user.profile_image}
                                    setPendingTournamentUsers={setPendingTournamentUsers}
                                    pendingTournamentUsers={pendingTournamentUsers}
                                />
                            ))}
                        </ScrollView>
                    :
                        <View style={styles.noPendingInvites}>
                            <Text style={styles.noPendingInvitesTxt}>{t('no-pending-invites')}</Text>
                        </View>
            }

            <Banner bannerId={process.env.PENDING_INVITES_BANNER_ID} />
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAIN_COLOR,
        flex: 1,
    },
    topBar: {
        backgroundColor: '#2F2766',
        flexDirection: 'row',
        paddingVertical: 15,
        marginTop: 20,
        paddingHorizontal: 5
    },
    topBarTxt: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        marginStart: 5
    },
    invitesContainer: {
        paddingHorizontal: 10
    },
    noPendingInvites: {
        marginVertical: 'auto'
    },
    noPendingInvitesTxt: {
        color: 'white',
        fontSize: 23,
        fontWeight: '600',
        textAlign: 'center'
    }
})