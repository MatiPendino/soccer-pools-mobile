import { View, StyleSheet } from "react-native"
import TeamLogo from "./TeamLogo"
import TeamScore from "./TeamScore"

export default function MatchResult ({currentMatchResult, matchResults, setMatchResults}) {

    return (
        <View style={styles.container}>
            <TeamLogo
                teamName={currentMatchResult.team_1}
                teamBadge={currentMatchResult.badge_team_1}
            />
            <TeamScore
                currentMatchResult={currentMatchResult}
                teamNum={1}
                matchResults={matchResults}
                setMatchResults={setMatchResults}
            />

            <TeamScore
                currentMatchResult={currentMatchResult}
                teamNum={2}
                matchResults={matchResults}
                setMatchResults={setMatchResults}
            />
            <TeamLogo
                teamName={currentMatchResult.team_2}
                teamBadge={currentMatchResult.badge_team_2}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 7,
        backgroundColor: 'rgb(250,250,250)',
        marginBottom: 20,
        marginHorizontal: 12,
        paddingHorizontal: 5,
        paddingVertical: 25,
        borderBlockColor: 'gray',
        borderWidth: 1,

    },
})