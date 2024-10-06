import { StyleSheet, Pressable, Text, Image, View } from "react-native"
import { Link } from "expo-router"

export default function TournamentCard({tournamentTitle, tournamentImgUrl}) {

    const selectTournament = () => {
        console.log('clicked')
    }

    return (
        <Link style={styles.tournamentContainer} href='/home'>
            <View style={styles.tournamentImgContainer}>
                <Image
                    source={tournamentImgUrl}
                    style={styles.tournamentImg}
                />
            </View>
            <Text style={styles.tournamentTxt}>{tournamentTitle}</Text>
        </Link>            
    )
}

const styles = StyleSheet.create({
    tournamentContainer: {
        width: '40%',
        textAlign: 'center',
        marginTop: 25
    },
    tournamentImgContainer: {
        width: '100%',
        textAlign: 'center',
        marginHorizontal: 'auto',
        backgroundColor: '#fdfdfd',
        borderRadius: 10,
        borderColor: '#d9d9d9',
        borderWidth: 1,
        paddingVertical: 10
    },
    tournamentImg: {
        width: 160,
        height: 160,
        textAlign: 'center',
        objectFit: 'contain'
    },
    tournamentTxt: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 15,
        fontWeight: '500'
    }
})