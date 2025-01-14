import { StyleSheet, Text, View } from "react-native"

interface MatchResultTopProps {
    roundState: number
    points: number
}

export default function MatchResultTop({roundState, points}: MatchResultTopProps) {

    if (roundState === 0) return <View></View>
    return (
        <View style={styles.topContainer}>
            <Text style={styles.topTxt}>
                {
                    roundState === 1
                    ?
                    'PENDING'
                    :
                    'FINALIZED'
                }
            </Text>

            <View style={styles.pointsContainer}>
                <Text style={styles.pointsTxt}>{points} pts</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginBottom: 5
    },
    topTxt: {
        fontSize: 16,
        fontWeight: '500'
    },
    pointsContainer: {
        backgroundColor: '#6860A1',
        borderRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    pointsTxt: {
        fontSize: 14,
        color: 'white',
        fontWeight: '600'
    }
})