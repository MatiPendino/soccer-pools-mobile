import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { MatchResultProps } from '../../../types';
import TeamLogo from './TeamLogo';
import ForecastResult from './ForecastResult';
import MatchResultTop from './MatchResultTop';
import Scores from './Scores';
import { useOriginalMatchResult } from '../../../hooks/useResults';

interface Props {
    currentMatchResult: MatchResultProps;
    matchResults: MatchResultProps[];
    setMatchResults: React.Dispatch<React.SetStateAction<MatchResultProps[]>>;
}

export default function MatchResult ({
    currentMatchResult, matchResults, setMatchResults
}: Props) {
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
                    <ActivityIndicator size='large' color='#0000ff' />
                :
                    <ForecastResult
                        forecastGoalsTeam1={currentMatchResult.goals_team_1}
                        forecastGoalsTeam2={currentMatchResult.goals_team_2}
                        goalsTeam1={originalMatchResult ? originalMatchResult.goals_team_1 : 0}
                        goalsTeam2={originalMatchResult ? originalMatchResult.goals_team_2 : 0}
                        matchState={currentMatchResult.match.match_state}
                    />
        );
    }

    return (
        <View style={styles.container}>
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
        
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 7,
        backgroundColor: 'rgb(250,250,250)',
        marginBottom: 20,
        marginHorizontal: 12,
        paddingHorizontal: 5,
        paddingVertical: 15,
        borderBlockColor: 'gray',
        borderWidth: 1,
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
})