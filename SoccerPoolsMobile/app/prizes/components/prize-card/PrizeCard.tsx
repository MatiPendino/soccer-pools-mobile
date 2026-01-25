import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PrizeProps } from 'types';
import { useBreakpoint } from 'hooks/useBreakpoint';
import { colors, spacing, typography, borderRadius } from '../../../../theme';
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

export default function PrizeCard({
    prize, onClaim, buttonLabel = 'Claim', isClaiming = false
}: PrizeCardProps) {
    const [open, setOpen] = useState<boolean>(false);
    const { width, isLG } = useBreakpoint();

    const cardWidth: number = isLG ? width * 0.28 : width * 0.46;
    const heroHeight: number = Math.max(160, cardWidth * 0.62);

    return (
        <Frame style={{ width: cardWidth }}>
            <View style={styles.card}>
                {/* HERO */}
                <View style={{ position: 'relative' }}>
                    <PrizeHero uri={prize.image} height={heroHeight} onInfo={() => setOpen(true)} />
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
        borderRadius: borderRadius.lg,
        backgroundColor: colors.backgroundCard,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    coinFloat: {
        position: 'absolute',
        bottom: -16,
        alignSelf: 'center',
    },
    body: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        alignItems: 'center',
        gap: spacing.sm,
    },
    title: {
        textAlign: 'center',
        fontSize: typography.fontSize.titleSmall,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        lineHeight: 22,
    },
    pointsNote: {
        fontSize: typography.fontSize.labelSmall,
        letterSpacing: 1.2,
        color: colors.textMuted,
    },
});