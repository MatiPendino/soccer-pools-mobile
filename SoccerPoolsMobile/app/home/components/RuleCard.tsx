import { Animated, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useBreakpoint } from '../../../hooks/useBreakpoint';

export default function RuleCard ({item, index, screenWidth, scrollX, t}) {
    const { isLG } = useBreakpoint();
    const inputRange = [ (index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth ];

    const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.8, 1, 0.8],
        extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.6, 1, 0.6],
        extrapolate: 'clamp',
    });

    if (isLG) {
        return (
            <View key={item.id} style={[styles.slide, {width: screenWidth}]}>
                <View style={[styles.ruleCard, {width: '50%'}]}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name={item.icon as any} size={48} color='#fff' />
                    </View>
                    <Text style={styles.ruleNumber}>
                        {t('rule')} {item.id}
                    </Text>
                    <Text style={styles.ruleTxt}>{item.text}</Text>
                </View>
            </View>
        )
    }

    return (
        <Animated.View 
            style={[
                styles.slide,
                {width: screenWidth, transform: [{ scale }], opacity},
            ]}
        >
            <View style={[styles.ruleCard, {width: '90%'}]}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name={item.icon} size={48} color='#fff' />
                </View>
                <Text style={styles.ruleNumber}>{t('rule')} {item.id}</Text>
                <Text style={styles.ruleTxt}>{item.text}</Text>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    ruleCard: {
        backgroundColor: '#2F2766',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    ruleNumber: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    ruleTxt: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 28,
    },
})