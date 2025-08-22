import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { useBreakpoint } from '../../../hooks/useBreakpoint';

interface Props {
    ruleId: number;
    ruleText: string;
    ruleIcon: string;
}

export default function RuleCard ({ruleId, ruleText, ruleIcon}: Props) {
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();

    return (
        <View key={ruleId} style={[styles.card, isLG && styles.cardLG]}>
            <View style={styles.iconBadge}>
                <MaterialIcons name={ruleIcon as any} size={22} />
            </View>
            <View style={styles.textWrap}>
                <View style={styles.ruleHeader}>
                <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{ruleId}</Text>
                </View>
                <Text style={styles.ruleTitle}>
                    {t('how-to-play')} #{ruleId}
                </Text>
                </View>
                <Text style={styles.ruleText}>{ruleText}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 14,
        elevation: 2,
    },
    cardLG: {
        padding: 16,
    },
    iconBadge: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EEF1F4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textWrap: {
        flex: 1,
    },
    ruleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    numberBadge: {
        backgroundColor: '#EDF6FF',
        borderColor: '#D6E9FF',
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        marginRight: 8,
    },
    numberText: {
        color: '#1C64F2',
        fontWeight: '700',
        fontSize: 12,
    },
    ruleTitle: {
        color: 'rgba(16,20,24,0.65)',
        fontSize: 12,
        fontWeight: '600',
    },
    ruleText: {
        color: '#222',
        fontSize: 15,
        lineHeight: 22,
    },
})