import { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = PropsWithChildren<{ style?: any }>;

export default function Frame({ style, children }: Props) {
  return (
    <LinearGradient
      colors={['#f7fafc', '#eef2f7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.frame, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 22,
    padding: 2,
  },
});
