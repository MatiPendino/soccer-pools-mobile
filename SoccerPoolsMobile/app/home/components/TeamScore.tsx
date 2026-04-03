import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
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

    const [teamGoals, setTeamGoals] = useState<number | null>(
        teamNum === 1 ? currentMatchResult.goals_team_1 : currentMatchResult.goals_team_2
    );

    useEffect(() => {
        setTeamGoals(
            teamNum === 1 ? currentMatchResult.goals_team_1 : currentMatchResult.goals_team_2
        );
    }, [matchResults]);

    const handleChange = (text: string) => {
        if (text === '') {
            setTeamGoals(null);
            const newMatchResults = matchResults.map((matchResult) => {
                if (matchResult.id === currentMatchResult.id) {
                    if (teamNum === 1) {
                        return { ...matchResult, goals_team_1: null };
                    } else {
                        return { ...matchResult, goals_team_2: null };
                    }
                }
                return matchResult;
            });
            if (arePredictionsSaved) setArePredictionsSaved(false);
            setMatchResults(newMatchResults);
            return;
        }

        const digit = text[text.length - 1];
        if (!/^[0-9]$/.test(digit)) return;

        const value = parseInt(digit, 10);
        setTeamGoals(value);

        const newMatchResults = matchResults.map((matchResult) => {
            if (matchResult.id === currentMatchResult.id) {
                if (teamNum === 1) {
                    return { ...matchResult, goals_team_1: value };
                } else {
                    return { ...matchResult, goals_team_2: value };
                }
            }
            return matchResult;
        });

        if (arePredictionsSaved) setArePredictionsSaved(false);
        setMatchResults(newMatchResults);
    };

    return (
        <View style={[
            styles.scoreContainer,
            isMobile && styles.scoreContainerMobile
        ]}>
            <TextInput
                style={[
                    styles.scoreInput,
                    isMobile && styles.scoreInputMobile
                ]}
                value={teamGoals !== null ? String(teamGoals) : ''}
                onChangeText={handleChange}
                keyboardType='numeric'
                maxLength={1}
                placeholder='-'
                placeholderTextColor='rgba(255,255,255,0.5)'
                textAlign='center'
                selectTextOnFocus
            />
        </View>
    );
}

const styles = StyleSheet.create({
    scoreContainer: {
        marginVertical: 'auto',
        marginHorizontal: 2,
    },
    scoreContainerMobile: {
        marginHorizontal: 1,
    },
    scoreInput: {
        backgroundColor: colors.accentDark,
        borderRadius: 8,
        width: 47,
        height: 47,
        fontSize: 19,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
    },
    scoreInputMobile: {
        width: 42,
        height: 42,
        fontSize: 17,
    },
});
