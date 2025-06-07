import { useEffect, useState } from "react"
import TournamentForm from "../../components/TournamentForm"
import { Router, useLocalSearchParams, useRouter } from "expo-router"
import { ToastType, useToast } from "react-native-toast-notifications"
import { getToken } from "../../utils/storeToken"
import handleError from "../../utils/handleError"
import { editTournament, retrieveTournament } from "../../services/tournamentService"
import { TournamentProps } from "../../types"
import { useTranslation } from "react-i18next"

export default function EditTournament () {
    const { t } = useTranslation()
    const { tournamentId } = useLocalSearchParams()
    const [tournament, setTournament] = useState<TournamentProps>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router: Router = useRouter()
    const toast: ToastType = useToast()

    if (!tournamentId || isNaN(Number(tournamentId))) {
        toast.show(t('wrong-tournament-id'), {type: 'danger'})
        router.replace('/home')
    }

    useEffect(() => {
        const getTournament = async () => {
            try {
                const token = await getToken()
                const tournament = await retrieveTournament(token, Number(tournamentId))
                setTournament(tournament)  
            } catch (error) {
                toast.show('There is been an error loading the tournament details', {type: 'danger'})
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
                router.push(`my-tournament/${tournament.id}`)    
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
