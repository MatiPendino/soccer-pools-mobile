import { View, Image, StyleSheet, Text } from "react-native"
import { API_URL } from "../../../services/api"

interface TeamLogoProps {
    teamBadge: string
    teamName: string
}

export default function TeamLogo({teamBadge, teamName}: TeamLogoProps) {

    return (
        <View style={styles.teamContainer}>
            <Image 
                style={styles.teamImg}
                source={{ uri: `${API_URL}${teamBadge}`}}
            />
            <Text style={styles.teamName}>
                {teamName}
            </Text>
        </View> 
    )
}

const styles = StyleSheet.create({
    teamContainer: {
        width: 110,
        textAlign: 'center',
        marginVertical: 'auto'
    },
    teamImg: {
        width: 70,
        height: 70,
        objectFit: 'contain',
        marginHorizontal: 'auto'
    },
    teamName: {
        textAlign: 'center'
    },
})