import { SetStateAction, useState } from "react"
import { StyleSheet, View, Text, Image, Pressable } from "react-native"
import { ToastType, useToast } from "react-native-toast-notifications"
import { updateStateTournamentUser } from "../../../services/tournamentService"
import { TournamentUserProps } from "../../../types"
import { ActivityIndicator } from "react-native-paper"
import { useTranslation } from "react-i18next"

interface PendingInviteCardProps {
    id: number
    token: string
    username: string
    userLogoUrl: string
    setPendingTournamentUsers: React.Dispatch<SetStateAction<TournamentUserProps[]>>
    pendingTournamentUsers: TournamentUserProps[]
}

export default function PendingInviteCard({
    id, token, username, userLogoUrl, setPendingTournamentUsers, pendingTournamentUsers
}: PendingInviteCardProps) {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const toast: ToastType = useToast()

    const handlePendingInvite = async (isAccept: boolean) => {
        setIsLoading(true)
        try {
            const tournamentState = isAccept ? 2 : 3
            await updateStateTournamentUser(token, id, tournamentState)
            setPendingTournamentUsers(pendingTournamentUsers.filter((tntUser) => tntUser.id != id))
        } catch (error) {
            toast.show('There is been an error updating the state', {type: 'danger'})
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Image 
                source={{uri: `${userLogoUrl}`}}
                style={styles.userLogoImg}
            />
            <Text style={styles.usernameTxt}>{username}</Text>
            {
                isLoading
                ?
                    <ActivityIndicator size="large" color="#0000ff" />
                :
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Pressable 
                            style={[styles.btn, styles.acceptBtn]} 
                            onPress={() => handlePendingInvite(true)}
                        >
                            <Text style={[styles.btnTxt]}>{t('accept')}</Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.btn, styles.rejectBtn]} 
                            onPress={() => handlePendingInvite(false)}
                        >
                            <Text style={[styles.btnTxt]}>{t('reject')}</Text>
                        </Pressable>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#dedede',
        paddingVertical: 10,
        borderRadius: 7
    },
    userLogoImg: {
        width: 30,
        height: 30,
        borderRadius: 100,
        objectFit: 'cover'
    },
    usernameTxt: {
        marginVertical: 'auto',
        fontSize: 15,
    },
    btn: {
        borderRadius: 4,
        padding: 7
    },
    acceptBtn: {
        backgroundColor: '#0C9A24'
    },
    rejectBtn: {
        backgroundColor: '#C52424'
    },
    btnTxt: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },

})