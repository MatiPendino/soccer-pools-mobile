import { View, StyleSheet, Image, Text } from "react-native"
import { API_URL } from "../services/api"

interface RankedPlayerProps {
    index: number
    profileImageUrl: string
    username: string
    points: number
}

export default function RankedPlayer({index, profileImageUrl, username, points}: RankedPlayerProps) {

    return (
        <View style={styles.container}>
            <Text style={styles.indexTxt}>{index}</Text>
            <Image 
                style={styles.profileImage}
                source={{uri: `${API_URL}${profileImageUrl}`}}
            />
            <Text style={styles.usernameTxt}>
                {username}
            </Text>    
            
            <Text style={styles.pointsTxt}>
                {points}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D9D9D9',
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 10,
        marginHorizontal: 15,
        borderRadius: 10,
        marginVertical: 8,
        textAlign: 'center'
    },
    indexTxt: {
        marginVertical: 'auto',
        fontWeight: '700',
        fontSize: 22,
        width: '10%',
        textAlign: 'center'
    },
    profileImage: {
        width: 60,
        height: 60,
        objectFit: 'contain',
    },
    usernameTxt: {
        marginVertical: 'auto',
        fontSize: 19,
        color: '#414141',
        fontWeight: '600',
        width: '60%',
        marginStart: 10
    },
    pointsTxt: {
        fontWeight: '600',
        marginVertical: 'auto',
        fontSize: 22,
        width: '20%'
    }
})