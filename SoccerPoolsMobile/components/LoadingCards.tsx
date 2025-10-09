import { useBreakpoint } from 'hooks/useBreakpoint';
import { StyleSheet, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

export default function LoadingCards({cardHeight, nCards, cardColor}) {
    const { isLG } = useBreakpoint();

    return (
        <View>
            {Array.from({ length: nCards }, (_, index) => (
                <ShimmerPlaceholder
                    key={index}
                    shimmerColors={[cardColor]}
                    style={[styles.rankedPlayersLoading, { height: cardHeight, width: isLG ? '50%' : '95%' }]}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    rankedPlayersLoading: { 
        marginBottom: 15,
        marginHorizontal: 'auto',
        borderRadius: 10,
        backgroundColor: '#000'
    },
})