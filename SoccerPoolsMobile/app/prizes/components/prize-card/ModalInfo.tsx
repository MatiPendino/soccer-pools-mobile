import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CoinPill from './CoinPill';
import GradientButton from './GradientButton';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  imageUri: string;
  prizeId: number
  coinsLabel: string;
  description?: string;
  width: number; 
  onClaim: (prizeId: number) => void;
  buttonLabel: string;
  isClaiming: boolean;
};

export default function ModalInfo({
  visible, onClose, title, imageUri, coinsLabel, description, width, onClaim, buttonLabel, prizeId, isClaiming
}: Props) {
  return (
    <Modal transparent visible={visible} animationType='fade' onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            { width: Math.min(width, 560) },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name='close' size={22} />
            </Pressable>
          </View>

          <View style={styles.hero}>
            <View style={styles.surface}>
              <Image source={{ uri: imageUri }} style={styles.img} resizeMode='contain' />
            </View>
          </View>

          <View style={styles.meta}>
            <CoinPill text={coinsLabel} />
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            {!!description && <Text style={styles.description}>{description}</Text>}
          </ScrollView>

          <GradientButton 
            title={buttonLabel} 
            onPress={() => { 
              onClose(); 
              onClaim(prizeId); 
            }} 
            prizeId={prizeId}
            style={styles.cta} 
            isClaiming={isClaiming}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  sheet: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 22,
    overflow: 'hidden',
    width: '90%',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: { flex: 1, fontSize: 18, fontWeight: '900', color: '#0B1220' },
  hero: { paddingHorizontal: 16, paddingBottom: 10 },
  surface: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 18,
    backgroundColor: '#F7F9FC',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EAEFF5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  img: { width: '100%', height: '100%' },
  meta: { paddingHorizontal: 16, paddingTop: 2, paddingBottom: 6 },
  body: { paddingHorizontal: 16, paddingVertical: 10 },
  description: { fontSize: 14, lineHeight: 20, color: '#334155' },
  cta: { marginHorizontal: 'auto', marginBottom: 14, marginTop: 6 },
});
