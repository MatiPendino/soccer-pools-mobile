import { useEffect, useState } from "react"
import { StyleSheet, Pressable, Text, Image, View } from "react-native"
import { useToast } from "react-native-toast-notifications"
import { useRouter } from "expo-router"
import { betsRegister } from "../../../services/betService"
import { getToken } from "../../../utils/storeToken"

export default function LeagueCard({leagueTitle, leagueImgUrl, leagueSlug}) {
    const toast = useToast()
    const router = useRouter()

    const selectLeague = async () => {
        try {
            const token = await getToken()
            const response = await betsRegister(token, leagueSlug)
            toast.show(`You have joined ${leagueTitle} league successfully!`, { type: 'success' });
            router.replace('/home')
        } catch (error) {
            toast.show('There is been an error joining the league. Please try later', { type: 'danger' });
        }
        
    }

    return (
        <Pressable 
            style={styles.leagueContainer} 
            onPress={() => selectLeague()}
        >
            <View style={styles.leagueImgContainer}>
                <Image
                    source={{ uri: leagueImgUrl }}
                    style={styles.leagueImg}
                />
            </View>
            <Text style={styles.leagueTxt}>{leagueTitle}</Text>
        </Pressable>
            
    )
}

const styles = StyleSheet.create({
    leagueContainer: {
        width: '100%',
        textAlign: 'center',
        marginTop: 25
    },
    leagueImgContainer: {
        width: '100%',
        textAlign: 'center',
        marginHorizontal: 'auto',
        backgroundColor: '#fdfdfd',
        borderRadius: 10,
        borderColor: '#d9d9d9',
        borderWidth: 1,
        paddingVertical: 10
    },
    leagueImg: {
        width: 160,
        height: 160,
        textAlign: 'center',
        objectFit: 'contain'
    },
    leagueTxt: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    }
})