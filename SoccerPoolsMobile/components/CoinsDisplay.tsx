import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'
import { useTranslation } from "react-i18next";
import { useToast, ToastType } from 'react-native-toast-notifications';
import { useRewardedAd } from './Ads';
import { updateCoins } from '../services/userService';
import { getToken } from '../utils/storeToken';

export default function CoinsDisplay({ coins }) {
    const { t } = useTranslation();
    const toast: ToastType = useToast();
    const [currentCoins, setCurrentCoins] = useState<number>(coins);

    useEffect(() => {
        setCurrentCoins(coins)
    }, [coins])

    const onEarnedReward = useCallback(async (amount: number) => {
        try {
            const token = await getToken()
            const { coins } = await updateCoins(token, amount)
            setCurrentCoins(coins)
            toast.show(t('coins-added', { coins: amount }), {type: 'success'})
        } catch (error) {
            toast.show(error, {type: 'danger'})
        }
    }, [])

    const { loaded, show } = useRewardedAd({onEarnedReward})

    return (
        <Pressable onPress={() => 
            loaded ? show() 
            : toast.show(t('ads-not-loaded'), {type: 'warning'})
        }  
        style={coinStyles.container}>
            <View style={coinStyles.coinsContainer}>
                <FontAwesome5 name="coins" size={16} color="#f59e0b" />
                <Text style={coinStyles.text}>{currentCoins}</Text>
                <Text style={coinStyles.plusText}>+</Text>
            </View>
        </Pressable>
    );
}

const coinStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    coinsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    text: {
        color: '#f59e0b',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 16,
    },
    plusText: {
        color: '#f59e0b',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 20,
    },
});