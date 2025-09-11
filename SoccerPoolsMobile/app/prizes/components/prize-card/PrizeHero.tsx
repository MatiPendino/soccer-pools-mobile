import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  uri: string;
  height: number;
  onInfo: () => void;
};

export default function Hero({ uri, height, onInfo }: Props) {
  return (
    <View style={[styles.hero, { height }]}>
      <View style={styles.surface}>
        <Image source={{ uri }} style={styles.img} resizeMode='contain' />
      </View>

      <Pressable
        onPress={onInfo}
        hitSlop={8}
        style={({ pressed }) => [styles.infoBtn, pressed && styles.pressed]}
      >
        <MaterialIcons name='info' size={18} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: 16,
    backgroundColor: '#F7F9FC',
    position: 'relative',
  },
  surface: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EAEFF5',
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  img: { width: '90%', height: '90%' },
  infoBtn: {
    position: 'absolute',
    right: 14,
    top: 14,
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5EAF0',
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
