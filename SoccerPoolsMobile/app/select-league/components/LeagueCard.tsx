import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { Ionicons } from '@expo/vector-icons'; 
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
                {item.coins_prizes.coins_prize_first && (
                    <View style={styles.prizeRibbon}>
                        <View style={styles.ribbonContainer}>
                            <Ionicons name="trophy" size={16} color="white" />
                            <Text style={styles.prizeText}>
                                {item.coins_prizes.coins_prize_first}
                            </Text>
                        </View>
                        <View style={styles.ribbonTail} />
                    </View>
                )}
                
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
                
                {
                    item.is_user_joined 
                    ? 
                    <View style={styles.memberBadge}>
                        <Text style={styles.memberText}>{t('joined')}</Text>
                    </View>
                    :
                    <View style={styles.costContainer}>
                        <View style={styles.costBadge}>
                            <Ionicons name="wallet-outline" size={14} color="#f59e0b" style={styles.costIcon} />
                            <Text style={styles.costText}>
                                {item.coins_cost || 0} {t('coins')}
                            </Text>
                        </View>
                        <Text style={styles.joinText}>{t('tap-to-join')}</Text>
                    </View>
                }
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
    costContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    costBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    costIcon: {
        marginRight: 4,
    },
    costText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#f59e0b',
    },
    joinText: {
        fontSize: 10,
        color: '#6b7280',
        marginTop: 4,
    },
    prizeRibbon: {
        position: 'absolute',
        top: 12,
        right: 0,
        zIndex: 10,
    },
    ribbonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f59e0b',
        paddingVertical: 4,
        paddingHorizontal: 8,
        paddingRight: 12,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    ribbonTail: {
        position: 'absolute',
        right: 0,
        bottom: -6,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderRightColor: 'transparent',
        borderTopColor: '#d97706',
        transform: [{ rotate: '180deg' }],
    },
    prizeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 4,
    },
})