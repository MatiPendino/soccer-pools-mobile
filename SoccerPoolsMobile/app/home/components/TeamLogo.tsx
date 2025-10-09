import { View, Image, StyleSheet, Text } from 'react-native';

interface TeamLogoProps {
    teamBadge: string;
    teamAcronym: string;
}

export default function TeamLogo({teamBadge, teamAcronym}: TeamLogoProps) {

    return (
        <View style={styles.teamContainer}>
            <Image 
                style={styles.teamImg}
                source={{ uri: `${teamBadge}`}}
            />
            <Text style={styles.teamAcronym}>
                {teamAcronym}
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
        width: 50,
        height: 50,
        objectFit: 'contain',
        marginHorizontal: 'auto'
    },
    teamAcronym: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
    },
})