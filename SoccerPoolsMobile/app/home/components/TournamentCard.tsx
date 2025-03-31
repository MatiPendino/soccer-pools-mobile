import { View, StyleSheet, Text, Image, ActivityIndicator, Pressable } from 'react-native'
import { useEffect, useState } from 'react'
import { ToastType, useToast } from 'react-native-toast-notifications'
import { Router, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MAIN_COLOR } from '../../../constants'
import { getToken } from '../../../utils/storeToken'
import { patchTournamentUser, retrieveTournamentUser } from '../../../services/tournamentService'
import { Email, TournamentUserProps } from '../../../types'

interface TournamentCardProps {
    name: string
    logoUrl: string
    nParticipants: number
    adminEmail: Email
    adminUsername: string
    tournamentId: number
    leagueId: number
}

export default function TournamentCard({
    name, logoUrl, nParticipants, adminEmail, adminUsername, tournamentId, leagueId,
}: TournamentCardProps) {
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
    }, [])

    const getStateInfo = () => {
        if (!tournamentUser) return { color: '#0C9A24', text: t('apply'), icon: 'add-circle-outline' }
        
        switch (tournamentUser.tournament_user_state) {
            case 0:
                return { color: '#0C9A24', text: t('apply'), icon: 'add-circle-outline' }
            case 1:
                return { color: '#F9A826', text: t('pending'), icon: 'hourglass-empty' }
            case 2:
                return { color: '#2E7DFF', text: t('joined'), icon: 'check-circle-outline' }
            case 3:
                return { color: '#E63946', text: t('rejected'), icon: 'cancel-outline' }
            default:
                return { color: '#0C9A24', text: t('apply'), icon: 'add-circle-outline' }
        }
    }

    const tournamentStateConversion = (): React.JSX.Element => {
        const stateInfo = getStateInfo()
        
        return (
            <View style={[styles.stateContainer, { backgroundColor: `${stateInfo.color}20` }]}>
                {/* @ts-ignore */}
                <MaterialIcons name={stateInfo.icon} size={16} color={stateInfo.color} />
                <Text style={[styles.stateTxt, { color: stateInfo.color }]}>{stateInfo.text}</Text>
            </View>
        )
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
        if (!tournamentUser) return
        
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
                        isAdmin: String(tournamentUser.user.email == adminEmail),
                    },
                })
                break
            case 3:
                toast.show(t('request-rejected'), {type: 'error'})
                break
        }
    }

    return (
        <Pressable 
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed
            ]} 
            onPress={handleCard}
        >
            <View style={styles.contentContainer}>
                <View style={styles.logoContainer}>
                    {
                        logoUrl 
                        ? 
                        <Image source={{ uri: `${logoUrl}` }} style={styles.logoImg} /> 
                        : 
                        <View style={styles.placeholderLogo}>
                            <Text style={styles.placeholderText}>{name.charAt(0)}</Text>
                        </View>
                    }
                </View>
                
                <View style={styles.textsContainer}>
                    <Text style={styles.tournamentNameTxt} numberOfLines={1} ellipsizeMode='tail'>
                        {name}
                    </Text>
                    
                    <View style={styles.adminContainer}>
                        <MaterialIcons name='person' size={14} color='#555' style={styles.adminIcon} />
                        <Text style={styles.adminTxt} numberOfLines={1} ellipsizeMode='tail'>
                            {adminUsername}
                        </Text>
                    </View>
                    
                    <View style={styles.participantsContainer}>
                        <MaterialIcons name='people' size={14} color='#555' style={styles.participantsIcon} />
                        <Text style={styles.participantsTxt}>
                            {nParticipants} {nParticipants === 1 ? 'participant' : 'participants'}
                        </Text>
                    </View>
                </View>
            </View>
        
            <View style={styles.stateWrapper}>
                {
                    !isLoading 
                    ? 
                    tournamentStateConversion()
                    : 
                    <ActivityIndicator size='small' color={MAIN_COLOR} />
                }
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    pressed: {
        opacity: 0.9,
        backgroundColor: '#f8f8f8',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    logoContainer: {
        marginRight: 12,
    },
    logoImg: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f0f0f0',
    },
    placeholderLogo: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#888',
    },
    textsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    tournamentNameTxt: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        marginBottom: 4,
    },
    adminContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    adminIcon: {
        marginRight: 4,
    },
    adminTxt: {
        color: '#555',
        fontSize: 14,
        fontWeight: '500',
    },
    participantsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    participantsIcon: {
        marginRight: 4,
    },
    participantsTxt: {
        fontSize: 14,
        color: '#555',
        fontWeight: '400',
    },
    stateWrapper: {
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
    stateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        justifyContent: 'center',
    },
    stateTxt: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
})