import { View, StyleSheet } from "react-native"
import { MatchResultProps } from "../../../types"
import TeamLogo from "./TeamLogo"
import TeamScore from "./TeamScore"


interface Props {
    currentMatchResult: MatchResultProps
    matchResults: MatchResultProps[]
    setMatchResults: React.Dispatch<React.SetStateAction<MatchResultProps[]>>
}

export default function MatchResult ({
    currentMatchResult, matchResults, setMatchResults
}: Props) {

    return (
        <View style={styles.container}>
            <TeamLogo
                teamName={currentMatchResult.match.team_1.name}
                teamBadge={currentMatchResult.match.team_1.badge}
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
                teamName={currentMatchResult.match.team_2.name}
                teamBadge={currentMatchResult.match.team_2.badge}
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