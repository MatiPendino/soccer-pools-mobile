import { View, StyleSheet, Pressable, Text, ScrollView, Image } from "react-native"
import TournamentCard from "./components/TournamentCard"

export default function SelectTournament({}) {

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.selectTournamentTxt}>Select a Tournament</Text>
            <View style={styles.tournamentsContainer}>
                <TournamentCard
                    tournamentImgUrl={require('../../assets/img/Logo_River_Plate.png')}
                    tournamentTitle='Superliga de Fútbol Argentino'
                />
                <TournamentCard
                    tournamentImgUrl={require('../../assets/img/Logo_River_Plate.png')}
                    tournamentTitle='Superliga de Fútbol Argentino'
                />
                <TournamentCard
                    tournamentImgUrl={require('../../assets/img/Logo_River_Plate.png')}
                    tournamentTitle='Superliga de Fútbol Argentino'
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
        height: '100%'
    },
    selectTournamentTxt: {
        color: '#fff',
        fontSize: 26,
        marginTop: 60,
        textAlign: 'center',
        fontWeight: '600'
    },
    tournamentsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    }
})