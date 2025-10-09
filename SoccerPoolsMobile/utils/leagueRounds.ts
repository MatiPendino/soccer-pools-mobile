import { roundsListByLeague } from '../services/leagueService';
import { RoundProps, RoundsStateProps, Slug } from '../types';

export async function getRounds(token, leagueId, notGeneralRound=undefined) {
    try {
        if (leagueId) {
            const roundsByLeague: RoundProps[] = await roundsListByLeague(
                token, leagueId, notGeneralRound
            );
            return roundsByLeague;
        }
    } catch (error) {
        throw error.response.data;
    }
}

export function getRoundsState(roundsByLeague, nextRoundId=0) {
    /* 
        To manage the current selected round, create a list of objects 
        in the format roundSlug: boolean.
        Initially, the first round will be true, and the rest false
    */
    const roundsStateObject = roundsByLeague.reduce((
        activeRoundsState: RoundsStateProps, round: RoundProps, index: number
    ) => {
        if (nextRoundId === 0) {
            activeRoundsState[round.slug] = index === 0; 
        } else {
            activeRoundsState[round.slug] = round.id === nextRoundId;    
        }
        
        return activeRoundsState;
    }, {} as RoundsStateProps)
    
    return roundsStateObject;
}

export const updateActiveRound = (roundSlug: Slug, roundsState: RoundsStateProps): RoundsStateProps => {
    const newRoundsState = Object.keys(roundsState).reduce((
        updatedRoundsState: RoundsStateProps, key
    ) => {
        updatedRoundsState[key] = key === roundSlug;
        return updatedRoundsState;
    }, {} as RoundsStateProps);

    return newRoundsState;
};

export const swapRoundsBetLeaders = async (
    roundSlug: Slug, roundsState: RoundsStateProps
) => {
    try {
        const newRoundsState = updateActiveRound(roundSlug, roundsState);

        return {
            newRoundsState: newRoundsState
        };
    } catch (error) {
        throw error;
    } 
};
