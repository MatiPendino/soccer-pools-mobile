import { SetStateAction, useState } from "react"
import { StyleSheet, View, Text, Image, Pressable, ActivityIndicator } from "react-native"
import { ToastType, useToast } from "react-native-toast-notifications"
import { updateStateTournamentUser } from "../../../services/tournamentService"
import { TournamentUserProps } from "../../../types"
import handleError from "../../../utils/handleError"
import { useTranslation } from "react-i18next"
import { useBreakpoint } from '../../../hooks/useBreakpoint';

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
    const { isLG } = useBreakpoint();

    const handlePendingInvite = async (isAccept: boolean) => {
        setIsLoading(true)
        try {
            const tournamentState = isAccept ? 2 : 3
            await updateStateTournamentUser(token, id, tournamentState)
            setPendingTournamentUsers(pendingTournamentUsers.filter((tntUser) => tntUser.id != id))
        } catch (error) {
            toast.show(handleError(error), {type: 'danger'})
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Image 
                source={{uri: `${userLogoUrl}`}}
                style={[styles.userLogoImg, {
                    width: isLG ? 60 : 45,
                    height: isLG ? 60 : 45
                }]}
            />
            <Text style={[styles.usernameTxt, {fontSize: isLG ? 18 : 15,}]}>{username}</Text>
            {
                isLoading
                ?
                    <ActivityIndicator size="large" color="#0000ff" />
                :
                    <View style={styles.btnsContainer}>
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
                            <Text style={[styles.btnTxt, { fontSize: isLG ? 16 : 13 }]}>
                                {t('reject')}
                            </Text>
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
        borderRadius: 100,
        objectFit: 'cover'
    },
    usernameTxt: {
        marginVertical: 'auto',
    },
    btnsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 'auto',
        gap: 10,
    },
    btn: {
        borderRadius: 4,
        padding: 7,
    },
    acceptBtn: {
        backgroundColor: '#0C9A24'
    },
    rejectBtn: {
        backgroundColor: '#C52424'
    },
    btnTxt: {
        color: 'white',
        fontWeight: '500',
    },
})