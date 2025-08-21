import { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { RoundProps, RoundsStateProps, Slug } from "../../types";
import RoundListModal from "./RoundListModal";
import ArrowButton from "./ArrowButton";
import NoRounds from "./NoRounds";
import { PURPLE_COLOR } from "../../constants";
import CurrentRoundButton from "./CurrentRoundButton";

interface Props {
  rounds: RoundProps[];
  handleRoundSwap: (roundId: number, roundSlug: Slug) => void;
  roundsState: RoundsStateProps;
  isResultsTab?: boolean;
}

export default function RoundsPicker({
    rounds, handleRoundSwap, roundsState, isResultsTab = false,
}: Props) {
    const [open, setOpen] = useState<boolean>(false);

    // If it's the results tab, only show rounds that have bets
    const visibleRounds = useMemo(
        () => (isResultsTab ? rounds.filter(round => round.has_bet_round) : rounds),
        [rounds, isResultsTab]
    );

    // Get the current index, the one marked true in roundsState
    const currentIndex = useMemo(() => {
        const activeSlug = Object.keys(roundsState).find(s => roundsState[s]);
        const index = visibleRounds.findIndex(round => round.slug === activeSlug);

        return index >= 0 ? index : 0;
    }, [visibleRounds, roundsState]);

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
            <ArrowButton onPress={onPrev} direction="left" disabled={atStart} />

            {/* Current round */}
            <CurrentRoundButton setOpen={setOpen} currentName={current.name} />

            {/* Right arrow */}
            <ArrowButton onPress={onNext} direction="right" disabled={atEnd} />

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
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 6,
        marginVertical: 8,
        marginHorizontal: 12,
    },
});