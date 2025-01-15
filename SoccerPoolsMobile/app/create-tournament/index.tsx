import TournamentForm from "../../components/TournamentForm";
import { Router, useLocalSearchParams, useRouter } from "expo-router";
import { ToastType, useToast } from "react-native-toast-notifications";
import { getToken } from "../../utils/storeToken";
import { createTournament } from "../../services/tournamentService";
import { useTranslation } from "react-i18next";

export default function CreateTournament () {
    const { t } = useTranslation()
    const router: Router = useRouter()
    const toast: ToastType = useToast()
    const { leagueId } = useLocalSearchParams()

    const handleCreate = async (data) => {
        try {
            const token = await getToken()
            const tournament = await createTournament(
                token, data.name, data.description, data.logo, Number(leagueId)
            )
            if (tournament) {
                toast.show(t('tournament-created-successfully'))
                router.push({
                    pathname: 'my-tournament',
                    params: {
                        tournamentName: data.name,
                        tournamentId: tournament.id,
                        leagueId: leagueId,
                        isAdmin: 'true'
                    }
                })    
            }
        } catch (error) {
            toast.show('There is been an error creating the tournament', {type: 'danger'})
        } 
    }

    return (
        <TournamentForm 
            onSubmit={handleCreate} 
            buttonLabel={t('create-tournament')}
            isCreationMode={true}
        />
    )
}
