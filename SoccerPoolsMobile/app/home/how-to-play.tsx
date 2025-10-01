import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MAIN_COLOR } from '../../constants';
import { useBreakpoint } from '../../hooks/useBreakpoint';
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
      { id: 1, text: t('htp-1'), icon: 'sports-soccer' },
      { id: 2, text: t('htp-2'), icon: 'cancel' },
      { id: 3, text: t('htp-3'), icon: 'emoji-events' },
      { id: 4, text: t('htp-4'), icon: 'leaderboard' },
      { id: 5, text: t('htp-5'), icon: 'groups' },
    ],
    [t]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isLG && styles.headerTitleLG]}>
          {t('how-to-play')}
        </Text>
      </View>

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
    backgroundColor: MAIN_COLOR,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerTitleLG: {
    fontSize: 36,
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  contentLG: {
    alignSelf: 'center',
    width: '100%',
  },
});