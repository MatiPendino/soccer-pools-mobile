import { useEffect, useState } from "react"
import TournamentForm from "../../components/TournamentForm"
import { Router, useLocalSearchParams, useRouter } from "expo-router"
import { ToastType, useToast } from "react-native-toast-notifications"
import { getToken } from "../../utils/storeToken"
import { editTournament, retrieveTournament } from "../../services/tournamentService"
import { TournamentProps } from "../../types"
import { ActivityIndicator } from "react-native"

export default function EditTournament () {
    const { tournamentId } = useLocalSearchParams()
    const [tournament, setTournament] = useState<TournamentProps>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router: Router = useRouter()
    const toast: ToastType = useToast()

    useEffect(() => {
        const getTournament = async () => {
            try {
                const token = await getToken()
                const tournament = await retrieveTournament(token, Number(tournamentId))
                setTournament(tournament)  
            } catch (error) {
                toast.show('There is been an error loading the tournament details', {type: 'dangee'})
            } finally {
                setIsLoading(false)
            }
        }

        getTournament()
    }, [])

    const handleEdit = async (data) => {
        try {
            const token = await getToken()
            const leagueId = tournament.league.id
            const updatedTournament = await editTournament(
                token, data.name, data.description, data.logo, leagueId
            )
            if (updatedTournament) {
                toast.show('Your tournament was updated successfully!')
                router.push({
                    pathname: 'my-tournament',
                    params: {
                        tournamentName: data.name,
                        tournamentId: tournamentId,
                        leagueId: leagueId,
                        isAdmin: 'true'
                    }
                })    
            }
        } catch (error) {
            toast.show('There is been an error updating the tournament', {type: 'danger'})
        } 
    }

    if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />
    return (
        <TournamentForm 
            initialData={tournament} 
            onSubmit={handleEdit} 
            buttonLabel="EDIT TOURNAMENT" 
            isCreationMode={false}
        />
    )
}
