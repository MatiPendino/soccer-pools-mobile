
export default function TeamScoresContainer({}) {

    return (
        <>
            <TeamScore
                currentMatchResult={currentMatchResult}
                matchResults={matchResults}
                setMatchResults={setMatchResults}
            />

            <TeamScore
                currentMatchResult={currentMatchResult}
                matchResults={matchResults}
                setMatchResults={setMatchResults}
            />
        </>
        
    )
}