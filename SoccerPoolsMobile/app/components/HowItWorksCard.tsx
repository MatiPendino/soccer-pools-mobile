import { StyleSheet, View, Text, Image, Platform } from 'react-native'
import { PURPLE_COLOR } from '../../constants';

interface HowItWorksCardProps {
    id: number;
    icon: any;
    title: string;
    text: string;
}

export default function HowItWorksCard ({ id, icon, title, text }: HowItWorksCardProps) {
    return (
        <View
            key={title}
            style={[
                styles.card,
                Platform.OS === 'web'
                ? { width: id <= 3 ? '28%' : '45%' }
                : { width: id !== 5 ? '47%' : '75%' }
            ]}
        >
            <Image source={icon} style={styles.cardIcon} />
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardText}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#EFEBE9',
        paddingVertical: Platform.OS === 'web' ? 20 : 10,
        paddingHorizontal: Platform.OS === 'web' ? 20 : 5,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10
    },
    cardIcon: {
        width: Platform.OS === 'web' ? 68 : 47,
        height: Platform.OS === 'web' ? 68 : 47,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: Platform.OS === 'web' ? 24 : 16,
        fontWeight: '600',
        color: PURPLE_COLOR,
        marginBottom: 8,
    },
    cardText: {
        fontSize: Platform.OS === 'web' ? 18 : 14,
        color: PURPLE_COLOR,
    },
})