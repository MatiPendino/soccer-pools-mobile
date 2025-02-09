import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { RoundProps, RoundsStateProps, Slug } from "../types";
import RoundItem from "./RoundItem";

interface Props {
    rounds: RoundProps[]
    handleRoundSwap: (roundId: number, roundSlug: Slug) => void
    roundsState: RoundsStateProps
}

export default function RoundsHorizontalList({rounds, handleRoundSwap, roundsState}: Props) {
    return (
        <FlatList
            data={rounds}
            renderItem={({item}) => (
                <RoundItem
                    roundId={item.id}
                    roundSlug={item.slug}
                    roundName={item.name}
                    roundsState={roundsState}
                    handleRoundSwap={handleRoundSwap}
                />
            )}
            horizontal={true}
            keyExtractor={(item) => item.slug}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.leaguesContainer}
        />
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
        marginBottom: 15
    }
})