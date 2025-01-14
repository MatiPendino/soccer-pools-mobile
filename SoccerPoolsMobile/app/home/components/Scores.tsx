import { View } from "react-native";
import TeamScore from "./TeamScore";
import { MatchResultProps } from "../../../types";

interface ScoresProps {
    currentMatchResult: MatchResultProps
    matchResults: MatchResultProps[]
    setMatchResults: React.Dispatch<React.SetStateAction<MatchResultProps[]>>
}

export default function Scores({currentMatchResult, matchResults, setMatchResults}: ScoresProps) {

    return (
        <View 
            style={{display: 'flex', flexDirection: 'row'}}
        >
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
        </View>  
    )
}