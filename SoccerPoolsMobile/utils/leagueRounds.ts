import { betsLeaders } from "../services/betService";
import { roundsListByLeague } from "../services/leagueService";
import { RoundProps, RoundsStateProps, Slug } from "../types";
import { getToken } from "./storeToken";

export async function getRounds(token, leagueId, notGeneralRound=undefined) {
    try {
        if (leagueId) {
            const roundsByLeague: RoundProps[] = await roundsListByLeague(
                token, leagueId, notGeneralRound
            )
            return roundsByLeague
        }
    } catch (error) {
        throw error.response.data
    }
}

export function getRoundsState(roundsByLeague, nextRoundId) {
    /* 
        To manage the current selected round, create a list of objects 
        in the format roundSlug: boolean.
        Initially, the first round will be true, and the rest false
    */
    const roundsStateObject = roundsByLeague.reduce((
        activeRoundsState: RoundsStateProps, round: RoundProps, index: number
    ) => {
        activeRoundsState[round.slug] = round.id === nextRoundId; 
        return activeRoundsState
    }, {} as RoundsStateProps)
    
    return roundsStateObject
}

export const getBetLeaders = async (token: string, roundSlug: Slug, tournamentId: number) => {
    try {
        const betLeaders = await betsLeaders(token, roundSlug, tournamentId)
        return betLeaders
    } catch (error) {
        throw error
    }
}

export const updateActiveRound = (roundSlug: Slug, roundsState: RoundsStateProps): RoundsStateProps => {
    const newRoundsState = Object.keys(roundsState).reduce((updatedRoundsState: RoundsStateProps, key) => {
        updatedRoundsState[key] = key === roundSlug
        return updatedRoundsState
    }, {} as RoundsStateProps)

    return newRoundsState
}

export const swapRoundsBetLeaders = async (
        roundSlug: Slug, tournamentId: number, roundsState: RoundsStateProps
    ) => {
    try {
        const token = await getToken()
        const betLeaders = await getBetLeaders(token, roundSlug, tournamentId)  
        const newRoundsState = updateActiveRound(roundSlug, roundsState)

        return {
            betLeaders: betLeaders, 
            newRoundsState: newRoundsState
        }
    } catch (error) {
        throw error
    } 
}
