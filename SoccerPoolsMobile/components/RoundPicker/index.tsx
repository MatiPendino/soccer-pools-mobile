import { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RoundProps, Slug } from '../../types';
import { colors, spacing, borderRadius } from '../../theme';
import RoundListModal from './RoundListModal';
import ArrowButton from './ArrowButton';
import NoRounds from './NoRounds';
import CurrentRoundButton from './CurrentRoundButton';

interface Props {
    rounds: RoundProps[];
    handleRoundSwap: (roundId: number, roundSlug: Slug) => void;
    activeRoundId: number | null;
    isResultsTab?: boolean;
}

export default function RoundsPicker({
    rounds, handleRoundSwap, activeRoundId, isResultsTab = false,
}: Props) {
    const [open, setOpen] = useState<boolean>(false);

    const visibleRounds = useMemo(
        () => (isResultsTab ? rounds.filter((round) => round.has_bet_round) : rounds),
        [rounds, isResultsTab]
    );

    const currentIndex = useMemo(() => {
        if (!activeRoundId) return 0;
        const index = visibleRounds.findIndex((round) => round.id === activeRoundId);
        return index >= 0 ? index : 0;
    }, [visibleRounds, activeRoundId]);

    const current = visibleRounds[currentIndex];

    const onChangeRound = (index: number) => {
        const round = visibleRounds[index];
        if (!round) return;
        handleRoundSwap(round.id, round.slug);
    };

    const onPrev = () => onChangeRound(Math.max(0, currentIndex - 1));
    const onNext = () => onChangeRound(Math.min(visibleRounds.length - 1, currentIndex + 1));

    const atStart = currentIndex <= 0;
    const atEnd = currentIndex >= visibleRounds.length - 1;

    if (!current) return <NoRounds />;

    return (
        <View style={styles.wrapper}>
            <ArrowButton onPress={onPrev} direction="left" disabled={atStart} />
            <CurrentRoundButton setOpen={setOpen} currentName={current.name} />
            <ArrowButton onPress={onNext} direction="right" disabled={atEnd} />
            <RoundListModal
                setOpen={setOpen}
                onChangeRound={onChangeRound}
                open={open}
                visibleRounds={visibleRounds}
                currentIndex={currentIndex}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        backgroundColor: colors.backgroundElevated,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
        marginVertical: spacing.sm,
        marginHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
});