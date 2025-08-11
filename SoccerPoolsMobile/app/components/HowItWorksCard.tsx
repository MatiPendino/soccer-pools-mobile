import { StyleSheet, View, Text, Image, Platform } from 'react-native'
import { PURPLE_COLOR } from '../../constants';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface HowItWorksCardProps {
    id: number;
    icon: any;
    title: string;
    text: string;
}

export default function HowItWorksCard ({ id, icon, title, text }: HowItWorksCardProps) {
    const { isLG } = useBreakpoint();

    return (
        <View
            key={title}
            style={[
                styles.card,
                isLG ? { width: id <= 3 ? '28%' : '45%' } : { width: id !== 5 ? '47%' : '75%' },
                { paddingVertical: isLG ? 20 : 10, paddingHorizontal: isLG ? 20 : 5 }
            ]}
        >
            <Image 
                source={icon} 
                style={[
                    styles.cardIcon,
                    { width: isLG ? 68 : 47, height: isLG ? 68 : 47 }
                ]} 
            />
            <Text style={[styles.cardTitle, { fontSize: isLG ? 24 : 16 }]}>
                {title}
            </Text>

            <Text style={[styles.cardText, { fontSize: isLG ? 18 : 14 }]}>
                {text}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#EFEBE9',
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10
    },
    cardIcon: {
        marginBottom: 12,
    },
    cardTitle: {
        fontWeight: '600',
        color: PURPLE_COLOR,
        marginBottom: 8,
    },
    cardText: {
        color: PURPLE_COLOR,
    },
})