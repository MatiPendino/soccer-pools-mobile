import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius } from '../../../theme';
import { MatchResultProps } from '../../../types';
import { useOriginalMatchResult } from '../../../hooks/useResults';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import TeamLogo from './TeamLogo';
import ForecastResult from './ForecastResult';
import MatchResultTop from './MatchResultTop';
import Scores from './Scores';

interface Props {
    currentMatchResult: MatchResultProps;
    matchResults: MatchResultProps[];
    setMatchResults: React.Dispatch<React.SetStateAction<MatchResultProps[]>>;
}

export default function MatchResult({
    currentMatchResult, matchResults, setMatchResults
}: Props) {
    const { isSM, isMD } = useBreakpoint();
    const isMobile = isSM || isMD;
    const isFinished = currentMatchResult.match.match_state === 2;
    const { data: originalMatchResult, isLoading } = useOriginalMatchResult(
        isFinished ? currentMatchResult.match.id : 0
    );

    const renderResult = () => {
        return (
            currentMatchResult.match.match_state === 0
                ?
                <Scores
                    currentMatchResult={currentMatchResult}
                    matchResults={matchResults}
                    setMatchResults={setMatchResults}
                />
                :
                isLoading
                    ?
                    <ActivityIndicator size='large' color={colors.accent} />
                    :
                    <ForecastResult
                        forecastGoalsTeam1={currentMatchResult.goals_team_1}
                        forecastGoalsTeam2={currentMatchResult.goals_team_2}
                        goalsTeam1={originalMatchResult ? originalMatchResult.goals_team_1 : 0}
                        goalsTeam2={originalMatchResult ? originalMatchResult.goals_team_2 : 0}
                        matchState={currentMatchResult.match.match_state}
                    />
        );
    };

    return (
        <View style={[
            styles.container,
            isMobile && styles.containerMobile
        ]}>
            <MatchResultTop
                matchState={currentMatchResult.match.match_state}
                points={currentMatchResult.points}
                startDate={currentMatchResult.match.start_date}
            />

            <View style={styles.contentContainer}>
                <TeamLogo
                    teamAcronym={currentMatchResult.match.team_1.acronym}
                    teamBadge={currentMatchResult.match.team_1.badge}
                />
                {renderResult()}
                <TeamLogo
                    teamAcronym={currentMatchResult.match.team_2.acronym}
                    teamBadge={currentMatchResult.match.team_2.badge}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.lg,
        backgroundColor: colors.backgroundCard,
        marginBottom: spacing.md,
        marginHorizontal: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    containerMobile: {
        paddingHorizontal: spacing.sm,
        marginHorizontal: spacing.sm,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});