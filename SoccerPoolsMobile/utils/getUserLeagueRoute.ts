import { getUserInLeague } from 'services/authService';

export const getUserLeagueRoute = async (token: string): Promise<string> => {
    // Check if the user is in a league
    if (!token) {
        return '/login';
    }
    const inLeague = await getUserInLeague(token);
    if (inLeague.in_league) {
        return '/home';
    } else {
        return '/select-league';
    }
};