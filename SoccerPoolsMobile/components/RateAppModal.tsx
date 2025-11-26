import { useState, useEffect } from 'react';
import { Modal, Pressable, Text, View, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { ANDROID_URL, REVIEW_APP_COINS_PRIZE, REWARD_APP_REVIEW } from '../constants';
import { useUpdateCoins } from '../hooks/useUser';

export default function RateAppModal({}) {
    const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
    const { t } = useTranslation();
    const { mutate: updateCoinsMutate } = useUpdateCoins();

    const askForRatingIfNeeded = async () => {
        const hasAsked = await AsyncStorage.getItem('was_asked_review');

        if (!hasAsked) {
            const nSessionsStr = await AsyncStorage.getItem('n_sessions');
            let nSessions = nSessionsStr ? parseInt(nSessionsStr) : 0;
        
            // Update login count
            nSessions += 1;
            await AsyncStorage.setItem('n_sessions', nSessions.toString());
        
            if (!hasAsked && nSessions >= 2) {
                // Wait a few seconds before showing
                setShowRatingModal(true);
                setTimeout(() => {
                    // Here ill trigger pop up
                    AsyncStorage.setItem('was_asked_review', 'true');
                }, 5000);
            }
        }
    }

    const handleRateApp = () => {
        const url = Platform.select({
            android: ANDROID_URL,
            ios: `itms-apps://itunes.apple.com/app/idYOUR_APP_ID`, //TODO Update
        });
        Linking.openURL(url);
        setShowRatingModal(false);

        updateCoinsMutate({coins: REVIEW_APP_COINS_PRIZE, rewardType: REWARD_APP_REVIEW});
    };

    useEffect(() => {
        if (Platform.OS !== 'web') {
            askForRatingIfNeeded();
        }
    }, []);

    return (
        <Modal
            visible={showRatingModal}
            transparent
            animationType='fade'
            onRequestClose={() => setShowRatingModal(false)}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            >
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 24,
                    width: '80%',
                    alignItems: 'center'
                }}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                        {t('enjoying-the-app')}
                    </Text>
                    <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                        {t('left-review', { coins: REVIEW_APP_COINS_PRIZE })}
                    </Text>
                    <Pressable
                        onPress={handleRateApp}
                        style={{
                            backgroundColor: '#1C154F',
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 8,
                            marginBottom: 10
                        }}
                    >
                        <Text style={{ color: 'white' }}>{t('rate-us')}</Text>
                    </Pressable>

                    <Pressable onPress={() => setShowRatingModal(false)}>
                        <Text style={{ color: '#888' }}>{t('maybe-later')}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}