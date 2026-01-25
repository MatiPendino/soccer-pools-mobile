import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { PageHeader } from '../../components/ui';
import { colors, spacing } from '../../theme';
import RuleCard from './components/RuleCard';

type RuleItem = {
    id: number;
    text: string;
    icon: string;
};

export default function HowToPlay() {
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();

    const rules: RuleItem[] = useMemo(
        () => [
            { id: 1, text: t('htp-1'), icon: 'football-outline' },
            { id: 2, text: t('htp-2'), icon: 'close-circle-outline' },
            { id: 3, text: t('htp-3'), icon: 'trophy-outline' },
            { id: 4, text: t('htp-4'), icon: 'podium-outline' },
            { id: 5, text: t('htp-5'), icon: 'people-outline' },
        ],
        [t]
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <PageHeader
                    badgeIcon="help-circle-outline"
                    badgeText={t('guide')}
                    title={t('how-to-play')}
                />
            </View>

            {/* Rules */}
            <ScrollView
                contentContainerStyle={[styles.content, isLG && styles.contentLG]}
                showsVerticalScrollIndicator={false}
            >
                {rules.map((rule) => (
                    <RuleCard
                        key={rule.id}
                        ruleId={rule.id}
                        ruleText={rule.text}
                        ruleIcon={rule.icon}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    content: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
        gap: spacing.md,
    },
    contentLG: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: 700,
    },
});