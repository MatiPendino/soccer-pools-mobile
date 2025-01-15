import { View, StyleSheet, Text, Image, ActivityIndicator, Pressable } from "react-native"
import { useEffect, useState } from "react"
import { ToastType, useToast } from "react-native-toast-notifications"
import { Router, useRouter } from "expo-router"
import { getToken } from "../../../utils/storeToken"
import { patchTournamentUser, retrieveTournamentUser } from "../../../services/tournamentService"
import { Email, TournamentUserProps } from "../../../types"
import { useTranslation } from "react-i18next"

interface TournamentCardProps {
    name: string
    logoUrl: string
    nParticipants: number
    adminEmail: Email
    adminUsername: string
    tournamentId: number
    leagueId: number
}

export default function TournamentCard(
    {name, logoUrl, nParticipants, adminEmail, adminUsername, tournamentId, leagueId}: TournamentCardProps) 
{
    const { t } = useTranslation()
    const [tournamentUser, setTournamentUser] = useState<TournamentUserProps>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const toast: ToastType = useToast()
    const router: Router = useRouter()

    const getTournamentUser = async () => {
        try {
            const token: string = await getToken()
            const data = await retrieveTournamentUser(token, tournamentId)
            setTournamentUser(data)
        } catch (error) {
            toast.show('There is been an error getting the tournament state', {type: 'danger'})
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        getTournamentUser()
    })

    const tournamentStateConversion = (): React.JSX.Element => {
        switch (tournamentUser.tournament_user_state) {
            case 0:
                return <Text style={[styles.stateTxt, {color: '#0C9A24'}]}>{t('apply')}</Text>
            case 1:
                return <Text style={[styles.stateTxt, {color: '#979A0C'}]}>{t('pending')}</Text>
            case 2:
                return <Text style={[styles.stateTxt, {color: '#6860A1'}]}>{t('joined')}</Text>
            case 3:
                return <Text style={[styles.stateTxt, {color: '#C52424'}]}>{t('rejected')}</Text>
        }
    }

    const joinTournament = async () => {
        setIsLoading(true)
        try {
            const token: string = await getToken()
            await patchTournamentUser(token, 1, tournamentUser.id)
            toast.show(t('join-request-sent'), {type: 'success'})
        } catch (error) {
            toast.show('There is been an error trying to send the join request', {type: 'error'})
        } finally {
            setIsLoading(false)
        }
    }

    const handleCard = () => {
        switch (tournamentUser.tournament_user_state) {
            case 0:
                joinTournament()
                break
            case 1:
                toast.show(t('already-request-sent'), {type: 'warning'})
                break
            case 2:
                router.push({
                    pathname: 'my-tournament', 
                    params: {
                        tournamentName: name,
                        tournamentId: tournamentId,
                        leagueId: leagueId,
                        isAdmin: String(tournamentUser.user.email == adminEmail)
                    }
                })
                break
            case 3:
                toast.show(t('request-rejected'), {type: 'error'})
                break
        }
    }

    return (
        <Pressable style={styles.container} onPress={handleCard}>
            <Image 
                source={{uri: `${logoUrl}`}}
                style={styles.logoImg}
            />
            <View style={styles.textsContainer}>
                <Text style={styles.tournamentNameTxt}>{name}</Text>
                <Text style={styles.adminTxt}>ADMIN: {adminUsername}</Text>
                {/*<Text style={styles.participantsTxt}>PARTICIPANTS: {nParticipants}</Text> */}
            </View>
            {
                !isLoading
                ?
                tournamentStateConversion()
                :
                <ActivityIndicator size="large" color="#0000ff" />
            }
        </Pressable>
    )
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#d9d9d9',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    logoImg: {
        width: 70,
        height: 70,
        borderRadius: 100,
        objectFit: 'contain',
        marginStart: 5
    },
    textsContainer: {},
    tournamentNameTxt: {
        fontSize: 19,
        fontWeight: '600'
    },
    adminTxt: {
        color: '#414141',
        fontSize: 15,
        fontWeight: '500'
    },
    participantsTxt: {
        fontSize: 15,
        fontWeight: '500'
    },
    stateTxt: {
        marginEnd: 5
    }
})