import { useEffect, useState } from "react"
import TournamentForm from "../../components/TournamentForm"
import { Router, useLocalSearchParams, useRouter } from "expo-router"
import { ToastType, useToast } from "react-native-toast-notifications"
import { getToken } from "../../utils/storeToken"
import handleError from "../../utils/handleError"
import { editTournament, retrieveTournament } from "../../services/tournamentService"
import { TournamentProps } from "../../types"
import { ActivityIndicator } from "react-native"
import { useTranslation } from "react-i18next"

export default function EditTournament () {
    const { t } = useTranslation()
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
        setIsLoading(true)
        try {
            const token = await getToken()
            const leagueId = tournament.league.id
            const updatedTournament = await editTournament(
                token, data.name, data.description, data.logo, tournament.id
            )
            if (updatedTournament) {
                toast.show(t('tournament-updated-successfully'))
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
            toast.show(handleError(error), {type: 'danger'})
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <TournamentForm 
            initialData={tournament} 
            isLoading={isLoading}
            onSubmit={handleEdit} 
            buttonLabel={t('edit-tournament')}
            isCreationMode={false}
        />
    )
}
