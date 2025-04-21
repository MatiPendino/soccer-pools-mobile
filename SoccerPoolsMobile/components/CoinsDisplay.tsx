import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { useTranslation } from "react-i18next";

export default function CoinsDisplay({ coins }) {
    const { t } = useTranslation();
    
    return (
        <View style={coinStyles.container}>
            <View style={coinStyles.coinsContainer}>
                <Ionicons name="wallet" size={18} color="#f59e0b" />
                <Text style={coinStyles.text}>{coins} {t('coins')}</Text>
            </View>
        </View>
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
        fontSize: 14,
    }
});