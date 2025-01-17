import { Pressable, StyleSheet, Text } from "react-native"
import { RoundsStateProps, Slug } from "../types"

interface RoundItemProps {
    handleRoundSwap: (roundId: number, roundSlug: Slug) => void
    roundId: number
    roundSlug: Slug
    roundName: string
    roundsState: RoundsStateProps
}

export default function RoundItem({
    handleRoundSwap, roundId, roundSlug, roundName, roundsState
}: RoundItemProps) {

    return (
        <Pressable 
            onPress={() => handleRoundSwap(roundId, roundSlug)}
            style={[styles.roundBtn, roundsState[roundSlug] ? styles.activeRoundBtn : '' ]}
        >
            <Text style={[styles.roundTxt, roundsState[roundSlug] ? styles.activeRoundTxt : '']}>
                {roundName.toUpperCase()}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    roundBtn: {
        marginHorizontal: 15,
        marginVertical: 0
    },
    roundTxt: {
        fontWeight: '700',
        fontSize: 17
    },
    activeRoundBtn: {
        borderBottomColor: '#6860A1',
        borderBottomWidth: 5,
    },
    activeRoundTxt: {
        color: '#6860A1'
    },
})