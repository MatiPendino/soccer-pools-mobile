import TournamentForm from "../../components/TournamentForm";
import { Router, useLocalSearchParams, useRouter } from "expo-router";
import { ToastType, useToast } from "react-native-toast-notifications";
import { getToken } from "../../utils/storeToken";
import handleError from "../../utils/handleError";
import { createTournament } from "../../services/tournamentService";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function CreateTournament () {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router: Router = useRouter()
    const toast: ToastType = useToast()
    const { leagueId } = useLocalSearchParams()

    const handleCreate = async (data) => {
        setIsLoading(true)
        try {
            const token = await getToken()
            const tournament = await createTournament(
                token, data.name, data.description, data.logo, Number(leagueId)
            )
            if (tournament) {
                toast.show(t('tournament-created-successfully'))
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
            onSubmit={handleCreate} 
            buttonLabel={t('create-tournament')}
            isCreationMode={true}
            isLoading={isLoading}
        />
    )
}
