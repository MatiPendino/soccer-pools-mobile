import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    listTournaments, retrieveTournament, createTournament, editTournament, 
    retrieveTournamentUser, listPendingTournamentUsers, updateStateTournamentUser
} from '../services/tournamentService';
import { getToken } from '../utils/storeToken';
import { TournamentProps } from '../types';

export const useTournaments = (leagueId: number, searchText: string) => {
    return useQuery({
        queryKey: ['tournaments', leagueId, searchText],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return listTournaments(token, leagueId, searchText);
        },
        enabled: !!leagueId,
    });
};

export const useTournament = (tournamentId: number) => {
    return useQuery({
        queryKey: ['tournament', tournamentId],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return retrieveTournament(token, tournamentId);
        },
        enabled: !!tournamentId,
    });
};

export const useCreateTournament = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (
            data: { name: string, description: string, logo: string, leagueId: number }
        ) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return createTournament(
                token, data.name, data.description, data.logo, data.leagueId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
        },
    });
};

export const useEditTournament = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (
            data: { name: string, description: string, logo: string, tournamentId: number }
        ) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return editTournament(
                token, data.name, data.description, data.logo, data.tournamentId
            );
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tournament', variables.tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
        },
    });
};

export const useTournamentUser = (tournamentId: number) => {
    return useQuery({
        queryKey: ['tournamentUser', tournamentId],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return retrieveTournamentUser(token, tournamentId);
        },
        enabled: !!tournamentId,
    });
};

export const usePendingTournamentUsers = (tournamentId: number) => {
    return useQuery({
        queryKey: ['pendingTournamentUsers', tournamentId],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return listPendingTournamentUsers(token, tournamentId);
        },
        enabled: !!tournamentId,
    });
};

export const useUpdateStateTournamentUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (
            data: { tournamentUserId: number, tournamentState: number }
        ) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return updateStateTournamentUser(
                token, data.tournamentUserId, data.tournamentState
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingTournamentUsers'] });
            queryClient.invalidateQueries({ queryKey: ['tournamentUser'] });
        },
    });
};
