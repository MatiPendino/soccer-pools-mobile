import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  text: string;
  style?: ViewStyle;
};

export default function CoinPill({ text, style }: Props) {

  return (
    <LinearGradient
      colors={['#0ea5e9', '#6366f1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.wrap, style]}
    >
      <View style={[styles.inner, { height: 30, paddingHorizontal: 12 }]}>
        <MaterialIcons name='monetization-on' size={16} color='#0B1220' />
        <Text style={[styles.text, { fontSize: 14, fontWeight: '800' }]}>
          {text}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 999,
    padding: 2,
    alignSelf: 'flex-start',
  },
  inner: {
    borderRadius: 999,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: { color: '#0B1220' },
});
