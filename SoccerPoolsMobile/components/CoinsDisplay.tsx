import { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next';
import { useToast, ToastType } from 'react-native-toast-notifications';
import { useRewardedAd } from 'components/ads/Ads';
import { REWARD_AD_REWARD } from '../constants';
import { useUpdateCoins } from '../hooks/useUser';

export default function CoinsDisplay({ coins }) {
    const { t } = useTranslation();
    const toast: ToastType = useToast();
    const { mutate: updateCoinsMutate } = useUpdateCoins();

    const onEarnedReward = useCallback((coins: number) => {
        updateCoinsMutate({ coins: coins, rewardType: REWARD_AD_REWARD }, {
            onSuccess: (data) => {
                toast.show(t('coins-added', { coins: coins }), { type: 'success' });
            },
            onError: (error) => {
                if (__DEV__) console.log(error);
                toast.show(error.message || 'Error adding coins', { type: 'danger' });
            }
        });
    }, []);

    const { loaded, show } = useRewardedAd({onEarnedReward});

    const handlePress = () => {
        if (loaded) {
            show();
        } else {
            toast.show(t('ads-not-loaded'), {type: 'warning'});
        }
    };

    const Wrapper = Platform.OS === 'web' ? View : Pressable;

    return (
        <Wrapper style={coinStyles.container} onPress={handlePress}>
            <View style={coinStyles.coinsContainer}>
                <FontAwesome5 name='coins' size={16} color='#f59e0b' />
                <Text style={coinStyles.text}>{coins}</Text>
                {Platform.OS === 'android' && (
                    <Text style={coinStyles.plusText}>+</Text>
                )}
            </View>
        </Wrapper>
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