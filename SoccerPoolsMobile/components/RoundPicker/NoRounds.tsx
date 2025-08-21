import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

export default function NoRounds() {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.emptyTxt}>{t('no-rounds-available')}</Text>
        </View>
    );
}
    

const styles = StyleSheet.create({
    container: { 
        padding: 12, 
        alignItems: 'center' 
    },
    emptyTxt: { 
        fontSize: 14, 
        opacity: 0.7 
    }
});
