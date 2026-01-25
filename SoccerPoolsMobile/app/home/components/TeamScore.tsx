import React, { useState, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors } from 'theme';
import { MatchResultProps } from '../../../types';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useResultsContext } from '../contexts/ResultsContext';

interface TeamScoreProps {
    currentMatchResult: MatchResultProps;
    teamNum: 1 | 2;
    matchResults: MatchResultProps[];
    setMatchResults: React.Dispatch<React.SetStateAction<MatchResultProps[]>>;
}

export default function TeamScore({
    currentMatchResult, teamNum, matchResults, setMatchResults
}: TeamScoreProps) {
    const { arePredictionsSaved, setArePredictionsSaved } = useResultsContext();
    const { isSM, isMD } = useBreakpoint();
    const isMobile = isSM || isMD;
    
    const [teamGoals, setTeamGoals] = useState<number>(
        teamNum === 1 ? currentMatchResult.goals_team_1 : currentMatchResult.goals_team_2
    );

    useEffect(() => {
        setTeamGoals(
            teamNum === 1 ? currentMatchResult.goals_team_1 : currentMatchResult.goals_team_2
        );
    }, [matchResults])

    const handleTeamGoals = (isAdding: boolean) => {
        let newMatchResults = matchResults;
        if (isAdding) {
            if (teamGoals === null) {
                setTeamGoals(0);
                newMatchResults = matchResults.map((matchResult) => {
                    if(matchResult.id === currentMatchResult.id) {
                        if (teamNum === 1) {
                            return {...matchResult, goals_team_1: 0};
                        } else {
                            return {...matchResult, goals_team_2: 0};
                        }
                    }
                    return matchResult;
                })
            } else {
                setTeamGoals(teamGoals + 1);
                newMatchResults = matchResults.map((matchResult) => {
                    if(matchResult.id === currentMatchResult.id) {
                        if (teamNum === 1) {
                            return {...matchResult, goals_team_1: teamGoals+1};
                        } else {
                            return {...matchResult, goals_team_2: teamGoals+1};
                        }
                    }
                    return matchResult;
                })
            }
            if (arePredictionsSaved) {
                setArePredictionsSaved(false);
            }
        } else {
            if (teamGoals > 0) {
                newMatchResults = matchResults.map((matchResult) => {
                    if(matchResult.id === currentMatchResult.id) {
                        if (teamNum === 1) {
                            return {...matchResult, goals_team_1: teamGoals-1};
                        } else {
                            return {...matchResult, goals_team_2: teamGoals-1};
                        }
                    }
                    return matchResult;
                })
                setTeamGoals(teamGoals - 1);
                if (arePredictionsSaved) {
                    setArePredictionsSaved(false);
                }
            }
        }
        setMatchResults(newMatchResults);
    }

    return (
        <View style={[
            styles.scoreContainer,
            isMobile && styles.scoreContainerMobile
        ]}>
            <Pressable
                onPress={() => handleTeamGoals(true)}
                style={[
                    styles.goalsBtn,
                    isMobile && styles.goalsBtnMobile
                ]}
                accessibilityRole='button'
            >
                <Text style={[
                    styles.goalsTxt,
                    isMobile && styles.goalsTxtMobile
                ]}>+</Text>
            </Pressable>
            <Text style={[
                styles.scoreTxt,
                isMobile && styles.scoreTxtMobile
            ]}>
                {
                    teamGoals !== null
                    ?
                    teamGoals
                    :
                    '-'
                }
            </Text>
            <Pressable
                onPress={() => handleTeamGoals(false)}
                style={[
                    styles.goalsBtn,
                    isMobile && styles.goalsBtnMobile
                ]}
            >
                <Text style={[
                    styles.goalsTxt,
                    isMobile && styles.goalsTxtMobile
                ]}>-</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    scoreContainer: {
        marginVertical: 'auto',
        marginHorizontal: 2
    },
    scoreContainerMobile: {
        marginHorizontal: 1,
    },
    goalsBtn: {
        backgroundColor: colors.accentDark,
        borderRadius: 30,
        width: 47,
        paddingVertical: 1,
    },
    goalsBtnMobile: {
        width: 42,
        paddingVertical: 0,
    },
    goalsTxt: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: 'white',
    },
    goalsTxtMobile: {
        fontSize: 16,
    },
    scoreTxt: {
        fontSize: 19,
        fontWeight: '600',
        marginVertical: 5,
        textAlign: 'center',
        color: 'white'
    },
    scoreTxtMobile: {
        fontSize: 17,
        marginVertical: 4,
    }
})