import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MAIN_COLOR, PURPLE_COLOR } from '../../../../constants';

type Props = {
  title: string;
  onPress: (prizeId: number) => void;
  style?: ViewStyle;
  textStyle?: any;
  prizeId: number;
  isClaiming: boolean;
};

export default function GradientButton({ 
  title, onPress, style, textStyle, prizeId, isClaiming=false 
}: Props) {
  return (
    <Pressable
      onPress={() => onPress(prizeId)}
      style={({ pressed }) => [styles.root, style, pressed && styles.pressed]}
      disabled={isClaiming}
    >
      <LinearGradient
        colors={[MAIN_COLOR, PURPLE_COLOR]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      >
        {
          isClaiming
          ?
          <ActivityIndicator size='small' color='white' />
          :
          <Text style={[styles.text, textStyle]}>{title}</Text>
        }
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '90%',
  },
  bg: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  pressed: { opacity: 0.96, transform: [{ scale: 0.985 }] },
});
