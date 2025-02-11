import { StyleSheet, View } from "react-native"
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

export default function LoadingCards({cardHeight, nCards, cardColor}) {
    const styles = StyleSheet.create({
        rankedPlayersLoading: { 
            width: "90%", 
            height: cardHeight, 
            marginBottom: 15,
            marginHorizontal: 'auto',
            borderRadius: 10,
            backgroundColor: '#000'
        },
    })

    return (
        <View>
            {Array.from({ length: nCards }, (_, index) => (
                <ShimmerPlaceholder
                    key={index}
                    shimmerColors={[cardColor]}
                    style={styles.rankedPlayersLoading}
                />
            ))}
        </View>
    )
}