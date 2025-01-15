import { Router, useLocalSearchParams } from "expo-router"
import { StyleSheet, View, Text, Pressable } from "react-native"
import { Entypo } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ToastType, useToast } from "react-native-toast-notifications"
import { useEffect, useState } from "react"
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"
import { ActivityIndicator } from "react-native-paper"
import { getToken } from "../../utils/storeToken"
import { listPendingTournamentUsers } from "../../services/tournamentService"
import { TournamentUserProps } from "../../types"
import PendingInviteCard from "./components/PendingInviteCard"
import { useTranslation } from "react-i18next"

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

    return (
        <GestureHandlerRootView style={styles.container}>
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
                        <FlatList
                            data={pendingTournamentUsers}
                            renderItem={({item}) => (
                                <PendingInviteCard
                                    id={item.id}
                                    token={token}
                                    username={item.user.username}
                                    userLogoUrl={item.user.profile_image}
                                    setPendingTournamentUsers={setPendingTournamentUsers}
                                    pendingTournamentUsers={pendingTournamentUsers}
                                />
                            )}
                            horizontal={false}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.invitesContainer}
                        />
                    :
                        <View style={styles.noPendingInvites}>
                            <Text style={styles.noPendingInvitesTxt}>{t('no-pending-invites')}</Text>
                        </View>
            }

        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
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