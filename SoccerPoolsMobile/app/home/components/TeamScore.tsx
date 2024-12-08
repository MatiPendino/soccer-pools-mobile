import React, { useState, useEffect } from "react"
import { View, Pressable, Text, StyleSheet } from "react-native"
import { MatchResultProps } from "../../../types"

interface TeamScoreProps {
    currentMatchResult: MatchResultProps
    teamNum: 1 | 2
    matchResults: MatchResultProps[]
    setMatchResults: React.Dispatch<React.SetStateAction<MatchResultProps[]>>
}

export default function TeamScore({
    currentMatchResult, teamNum, matchResults, setMatchResults
}: TeamScoreProps) {
    const [teamGoals, setTeamGoals] = useState<number>(
        teamNum === 1 ? currentMatchResult.goals_team_1 : currentMatchResult.goals_team_2
    )

    useEffect(() => {
        setTeamGoals(
            teamNum === 1 ? currentMatchResult.goals_team_1 : currentMatchResult.goals_team_2
        )
    }, [matchResults])

    const handleTeamGoals = (isAdding: boolean) => {
        let newMatchResults = matchResults
        if (isAdding) {
            setTeamGoals(teamGoals + 1)
            newMatchResults = matchResults.map((matchResult) => {
                if(matchResult.id === currentMatchResult.id) {
                    if (teamNum === 1) {
                        return {...matchResult, goals_team_1: teamGoals+1}
                    } else {
                        return {...matchResult, goals_team_2: teamGoals+1}
                    }
                }
                return matchResult
            })
        } else {
            if (teamGoals > 0) {
                newMatchResults = matchResults.map((matchResult) => {
                    if(matchResult.id === currentMatchResult.id) {
                        if (teamNum === 1) {
                            return {...matchResult, goals_team_1: teamGoals-1}
                        } else {
                            return {...matchResult, goals_team_2: teamGoals-1}
                        }
                    }
                    return matchResult
                })
                setTeamGoals(teamGoals - 1)
            }
        }
        setMatchResults(newMatchResults)
    }

    return (
        <View style={styles.scoreContainer}>
            <Pressable 
                onPress={() => handleTeamGoals(true)}
                style={styles.goalsBtn}
            >
                <Text style={styles.goalsTxt}>+</Text>
            </Pressable>
            <Text style={styles.scoreTxt}>
                {teamGoals}
            </Text>
            <Pressable 
                onPress={() => handleTeamGoals(false)}
                style={styles.goalsBtn}
            >
                <Text style={styles.goalsTxt}>-</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    scoreContainer: {
        marginVertical: 'auto'
    },
    goalsBtn: {
        backgroundColor: 'rgb(190,190,190)',
        borderRadius: 30,
        width: 45
    },
    goalsTxt: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center'
    },
    scoreTxt: {
        fontSize: 19,
        fontWeight: '600',
        marginVertical: 5,
        textAlign: 'center'
    }
})