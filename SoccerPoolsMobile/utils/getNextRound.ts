import { RoundProps } from "../types"

export const getNextRoundId = (rounds: RoundProps[]): number => {
    /*
        Based on a list of rounds, returns the id of the next one
        If there is a round on PENDING STATE (equals 1) returns it, otherwise the closest
        round in the future 
    */
    const currentDate = new Date()
    const pendingRounds = rounds.filter(({round_state}) => round_state === 1)
    const futureRounds = rounds.filter(({ start_date }) => new Date(start_date) > currentDate)

    if (pendingRounds.length > 0) {
        return pendingRounds[0].id
    }

    return futureRounds[0].id
}