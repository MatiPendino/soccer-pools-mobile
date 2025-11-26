import { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RoundProps, Slug } from '../../types';
import RoundListModal from './RoundListModal';
import ArrowButton from './ArrowButton';
import NoRounds from './NoRounds';
import { PURPLE_COLOR } from '../../constants';
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

    // If it's the results tab, only show rounds where the user has bets
    const visibleRounds = useMemo(
        () => (isResultsTab ? rounds.filter(round => round.has_bet_round) : rounds),
        [rounds, isResultsTab]
    );

    // Get the current index based on activeRoundId
    const currentIndex = useMemo(() => {
        if (!activeRoundId) return 0;
        const index = visibleRounds.findIndex(round => round.id === activeRoundId);
        return index >= 0 ? index : 0;
    }, [visibleRounds, activeRoundId]);

    const current = visibleRounds[currentIndex];

    // Cchange the round based on index
    const onChangeRound = (index: number) => {
        const round = visibleRounds[index];
        if (!round) return;
        handleRoundSwap(round.id, round.slug);
    };

    // Navigation functions
    const onPrev = () => onChangeRound(Math.max(0, currentIndex - 1));
    const onNext = () => onChangeRound(Math.min(visibleRounds.length - 1, currentIndex + 1));

    // Check if at start or end to disable arrows
    const atStart = currentIndex <= 0;
    const atEnd = currentIndex >= visibleRounds.length - 1;

    if (!current) return <NoRounds />;

    return (
        <View style={styles.wrapper}>
            {/* Left arrow */}
            <ArrowButton onPress={onPrev} direction='left' disabled={atStart} />

            {/* Current round */}
            <CurrentRoundButton setOpen={setOpen} currentName={current.name} />

            {/* Right arrow */}
            <ArrowButton onPress={onNext} direction='right' disabled={atEnd} />

            {/* Picker modal/list */}
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
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: PURPLE_COLOR,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 6,
        marginVertical: 8,
        marginHorizontal: 12,
    },
});