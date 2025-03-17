import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { Router, useRouter } from 'expo-router';
import { getToken } from '../../../utils/storeToken';
import { betsRegister } from '../../../services/betService';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.44;

export default function LeagueCard ({item, setIsLoading}) {
    const { t } = useTranslation()
    const toast: ToastType = useToast()
    const router: Router = useRouter()

    const selectLeague = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const token = await getToken()
            const response = await betsRegister(token, item.slug)
            if (response.status === 201) {
                toast.show(t('joined-league-successfully', {leagueTitle: item.name}), { type: 'success' });
            }
            router.replace('/home')
        } catch (error) {
            toast.show('There is been an error joining the league. Please try later', { type: 'danger' });
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => selectLeague()}
            activeOpacity={0.7}
        >
            <View style={[
                styles.card,
                { backgroundColor: item.is_user_joined ? '#e6f7ef' : '#f0f0f0' }
            ]}>
                <View style={[
                    styles.cardHeader,
                    { backgroundColor: item.is_user_joined ? '#22c55e' : '#d1d5db' }
                ]} />
                
                <View style={styles.logoContainer}>
                <Image
                    source={{ uri: item.logo }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                </View>
                
                <Text style={[
                    styles.leagueName, 
                    { color: item.is_user_joined ? '#166534' : '#4a5568' }
                ]}>
                    {item.name}
                </Text>
                
                {item.is_user_joined && (
                <View style={styles.memberBadge}>
                    <Text style={styles.memberText}>{t('joined')}</Text>
                </View>
                )}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 16, 
    },
    cardHeader: {
        height: 8,
        width: '100%',
    },
    cardContainer: {
        width: cardWidth,
        height: cardWidth * 1.3,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoContainer: {
        width: '80%',
        height: '50%', 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        marginTop: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    leagueName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 8,
        marginTop: 8,
        marginBottom: 8,
    },
    memberBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 12, 
    },
    memberText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#22c55e',
    },
})