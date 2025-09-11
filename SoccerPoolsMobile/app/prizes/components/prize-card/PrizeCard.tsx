
import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PrizeProps } from 'types';
import { useBreakpoint } from 'hooks/useBreakpoint';
import Frame from './Frame';
import PrizeHero from './PrizeHero';
import CoinPill from './CoinPill';
import GradientButton from './GradientButton';
import ModalInfo from './ModalInfo';

type PrizeCardProps = {
  prize: PrizeProps;
  onClaim: (prizeId: number) => void;
  buttonLabel?: string;
  isClaiming: boolean;
};

export default function PrizeCard({ prize, onClaim, buttonLabel ='Claim', isClaiming=false }: PrizeCardProps) {
  const [open, setOpen] = useState(false);
  const { width, isLG } = useBreakpoint();

  const cardWidth = isLG ? width * 0.28 : width * 0.46;
  const heroHeight = Math.max(160, cardWidth * 0.62);

  return (
    <Frame style={{ width: cardWidth }}>
      <View style={styles.card}>
        {/* HERO */}
        <View style={{ position: 'relative' }}>
          <PrizeHero uri={prize.image} height={heroHeight} onInfo={() => setOpen(true)} />
          {/* Coin Pill */}
          <CoinPill
            text={`${prize.coins_cost}`}
            style={styles.coinFloat}
          />
        </View>

        {/* Main */}
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>{prize.title}</Text>
          <Text style={styles.pointsNote}>{prize.coins_cost} COINS</Text>

          <GradientButton 
            prizeId={prize.id} 
            title={buttonLabel} 
            onPress={onClaim} 
            isClaiming={isClaiming}
          />
        </View>
      </View>

      {/* Modal */}
      <ModalInfo
        visible={open}
        onClose={() => setOpen(false)}
        title={prize.title}
        imageUri={prize.image}
        prizeId={prize.id}
        coinsLabel={`${prize.coins_cost} coins`}
        description={prize.description}
        width={Math.min(width * (isLG ? 0.5 : 0.92), 560)}
        onClaim={onClaim}
        buttonLabel={buttonLabel}
        isClaiming={isClaiming}
      />
    </Frame>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: 'white',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E9EEF3',
    shadowColor: 'black',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  coinFloat: {
    position: 'absolute',
    bottom: -16,
    alignSelf: 'center',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: '#0B1220',
    lineHeight: 22,
  },
  pointsNote: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: '#6B7280',
  },
});