import { RoundProps } from "../types"

export const getNextRoundId = (rounds: RoundProps[]): number => {
    /*
        Based on a list of rounds, returns the id of the next one
        If there is a round on PENDING STATE (equals 1) returns it, otherwise the closest
        round in the future 
    */
    const pendingRounds = rounds.filter(({round_state}) => round_state === 1)
    if (pendingRounds.length > 0) {
        return pendingRounds[0].id
    }

    const currentDate = new Date()
    let futureRounds = rounds.filter(({ start_date }) => new Date(start_date) > currentDate)

    /*
        If there are no rounds in the future, it is possible that exist rounds which date has not been
        set yet, so we filter all the NOT STARTED rounds (equals 0).
        If there are not NOT STARTED rounds, it means that all rounds have already been played
        and we need to return the id of the last round 
    */
    if (futureRounds.length === 0) {
        futureRounds = rounds.filter(({ round_state }) => round_state === 0)
        if (futureRounds.length === 0) {
            return rounds[rounds.length - 1].id
        }
    }

    return futureRounds[0].id
}