import { useState } from "react"
import { View, Pressable, Text, StyleSheet } from "react-native"

export default function TeamScore({goals}) {
    const [teamGoals, setTeamGoals] = useState(goals)

    const handleTeamGoals = (isAdding) => {
        if (isAdding) {
            setTeamGoals(teamGoals + 1)
        } else {
            if (teamGoals > 0) {
                setTeamGoals(teamGoals - 1)
            }
        }
    }

    return (
        <View style={styles.scoreContainer}>
            <Pressable 
                onPress={() => handleTeamGoals(true)}
                style={styles.goalsBtn}
            >
                <Text style={styles.goalsTxt}>+</Text>
            </Pressable>
            <Text style={styles.scoreTxt}>
                {teamGoals}
            </Text>
            <Pressable 
                onPress={() => handleTeamGoals(false)}
                style={styles.goalsBtn}
            >
                <Text style={styles.goalsTxt}>-</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    scoreContainer: {
        marginVertical: 'auto'
    },
    goalsBtn: {
        backgroundColor: 'rgb(190,190,190)',
        borderRadius: 30,
        width: 45
    },
    goalsTxt: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center'
    },
    scoreTxt: {
        fontSize: 19,
        fontWeight: '600',
        marginVertical: 5,
        textAlign: 'center'
    }
})