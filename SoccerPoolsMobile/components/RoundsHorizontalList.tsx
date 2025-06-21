import { StyleSheet, View, ScrollView, Platform } from "react-native";
import { RoundProps, RoundsStateProps, Slug } from "../types";
import RoundItem from "./RoundItem";

interface Props {
    rounds: RoundProps[]
    handleRoundSwap: (roundId: number, roundSlug: Slug) => void
    roundsState: RoundsStateProps
    isResultsTab?: Boolean
}

export default function RoundsHorizontalList({
    rounds, handleRoundSwap, roundsState, isResultsTab=false
}: Props) {
    return (
        <View>
            <ScrollView 
                contentContainerStyle={styles.leaguesContainer} 
                horizontal={true} 
                showsHorizontalScrollIndicator={Platform.OS === 'web'}
            >
                {rounds.map((round) => (
                    <RoundItem
                        key={round.id}
                        roundId={round.id}
                        roundSlug={round.slug}
                        roundName={round.name}
                        roundsState={roundsState}
                        hasBetRound={isResultsTab ? round.has_bet_round : true}
                        handleRoundSwap={handleRoundSwap}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    leaguesContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 7,
        backgroundColor: '#d9d9d9',
        height: 50,
        marginBottom: Platform.OS === 'web' ? 0 : 10
    }
})