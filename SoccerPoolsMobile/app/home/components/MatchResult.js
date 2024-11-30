import { useState } from "react"
import { API_URL } from "../../../services/api"
import { View, Text, StyleSheet, Pressable, Image } from "react-native"
import TeamLogo from "./TeamLogo"
import TeamScore from "./TeamScore"

export default function MatchResult ({matchResult}) {

    return (
        <View style={styles.container}>
            <TeamLogo
                teamName={matchResult.team_1}
                teamBadge={matchResult.badge_team_1}
            />
            <TeamScore
                goals={matchResult.goals_team_1}
            />

            <TeamScore
                goals={matchResult.goals_team_2}
            />
            <TeamLogo
                teamName={matchResult.team_2}
                teamBadge={matchResult.badge_team_2}
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