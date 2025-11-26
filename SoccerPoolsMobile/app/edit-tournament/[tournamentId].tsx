import { useEffect } from 'react';
import { Router, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ToastType, useToast } from 'react-native-toast-notifications';
import handleError from '../../utils/handleError';
import { useTournament, useEditTournament } from '../../hooks/useTournaments';
import TournamentForm from '../../components/TournamentForm';

export default function EditTournament() {
    const { t } = useTranslation();
    const { tournamentId } = useLocalSearchParams();
    const router: Router = useRouter();
    const toast: ToastType = useToast();

    const { data: tournament, isLoading: isTournamentLoading } = useTournament(Number(tournamentId));
    const { mutate: editTournamentMutate, isPending: isEditing } = useEditTournament();

    useEffect(() => {
        if (!tournamentId || isNaN(Number(tournamentId))) {
            toast.show(t('wrong-tournament-id'), { type: 'danger' });
            router.replace('/home');
        }
    }, [tournamentId]);

    const handleEdit = (data) => {
        editTournamentMutate({
            name: data.name,
            description: data.description,
            logo: data.logo,
            tournamentId: Number(tournamentId)
        }, {
            onSuccess: (updatedTournament) => {
                if (updatedTournament) {
                    toast.show(t('tournament-updated-successfully'));
                    router.push(`my-tournament/${tournamentId}`);
                }
            },
            onError: (error) => {
                toast.show(handleError(error.message), { type: 'danger' });
            }
        })
    }

    return (
        <TournamentForm 
            initialData={tournament} 
            isLoading={isTournamentLoading || isEditing}
            onSubmit={handleEdit} 
            buttonLabel={t('edit-tournament')}
            isCreationMode={false}
        />
    )
}
