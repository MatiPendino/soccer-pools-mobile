import { StyleSheet, Pressable, Text, Image, View } from "react-native"
import { useToast } from "react-native-toast-notifications"
import { useRouter } from "expo-router"
import { betsRegister } from "../../../services/betService"
import { getToken } from "../../../utils/storeToken"
import { Slug } from "../../../types"
import { useTranslation } from "react-i18next"

interface LeagueCardProps {
    leagueTitle: string
    leagueImgUrl: string
    leagueSlug: Slug
    isUserJoined: Boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LeagueCard({
    leagueTitle, leagueImgUrl, leagueSlug, isUserJoined, setIsLoading
}: LeagueCardProps) {
    const { t } = useTranslation()
    const toast = useToast()
    const router = useRouter()

    const selectLeague = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const token = await getToken()
            const response = await betsRegister(token, leagueSlug)
            if (response.status === 201) {
                toast.show(t('joined-league-successfully', {leagueTitle: leagueTitle}), { type: 'success' });
            }
            router.replace('/home')
        } catch (error) {
            toast.show('There is been an error joining the league. Please try later', { type: 'danger' });
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Pressable 
            style={styles.leagueContainer} 
            onPress={() => selectLeague()}
        >
            <View style={[
                styles.leagueImgContainer, 
                {backgroundColor: isUserJoined ? '#72ad81' : '#d9d9d9'}]
            }>
                <Image
                    source={{ uri: leagueImgUrl }}
                    style={styles.leagueImg}
                />
                {isUserJoined &&
                    <View style={styles.userJoinedFooter}>
                        <Text style={styles.userJoinedTxt}>{t('joined')}</Text>
                    </View>
                }
            </View>
            <Text style={styles.leagueTxt}>{leagueTitle}</Text>
        </Pressable>
            
    )
}

const styles = StyleSheet.create({
    leagueContainer: {
        width: 160,
        textAlign: 'center',
        marginTop: 25,
        marginHorizontal: 5
    },
    leagueImgContainer: {
        textAlign: 'center',
        marginHorizontal: 'auto',
        backgroundColor: '#fdfdfd',
        borderRadius: 10,
        borderColor: '#d9d9d9',
        borderWidth: 1,
        padding: 10
    },
    leagueImg: {
        width: 140,
        height: 140,
        textAlign: 'center',
        objectFit: 'contain'
    },
    leagueTxt: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        marginTop: 3,
        fontWeight: '500',
        textTransform: 'uppercase'
    },
    userJoinedFooter: {
        backgroundColor: '#d9d9d9',
        borderRadius: 5
    },
    userJoinedTxt: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 15,
        paddingVertical: 1
    }
})