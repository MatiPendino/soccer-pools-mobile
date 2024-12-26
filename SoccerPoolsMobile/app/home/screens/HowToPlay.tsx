import { useState } from "react"
import { View, Text, StyleSheet, Dimensions, FlatList, ScaledSize } from "react-native"

const { width: screenWidth }: ScaledSize = Dimensions.get("window")

const data = [
    { id: 1, text: 'You will be able to complete the outcome of a match before it begins. Do not forget to click "SAVE PREDICTIONS" to update the results' },
    { id: 2, text: 'Suspended/Cancelled matches in leagues will not be considered. Postponed cup matches will be considered once they are played' },
    { id: 3, text: 'If you hit the winner or draw, you will get 1 point. If you get the exact outcome, you will get 3 points. 0 points if you miss the outcome' },
    { id: 4, text: 'You can create as many tournaments and join as many as you like' },
    { id: 5, text: 'The app is free, and contains adds. If you wish to avoid adds, you can get the premium no adds version. It will be truly appreciated' },
]

export default function HowToPlay({}) {
    const [activeSlide, setActiveSlide] = useState<number>(0)

    const renderItem = ({ item }) => (
        <View style={styles.slide}>
            <View style={styles.ruleRectangle}>
                <Text style={styles.ruleTxt}>{item.text}</Text>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                onScroll={(event) => {
                    const index = Math.round(
                        event.nativeEvent.contentOffset.x / screenWidth
                    );
                    setActiveSlide(index);
                }}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.paginationContainer}>
                {data.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeSlide && styles.paginationDotActive,
                        ]}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#6860A1",
        alignItems: "center",
        justifyContent: "center",
    },
    slide: {
        width: screenWidth,
        justifyContent: "center",
        alignItems: "center",
    },
    ruleRectangle: {
        backgroundColor: "#2F2766",
        borderRadius: 10,
        padding: 30,
        width: "80%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    ruleTxt: {
        fontSize: 19,
        color: "white",
        fontWeight: '500',
        textAlign: "center",
        lineHeight: 29,
        textTransform: 'capitalize'
    },
    paginationContainer: {
        flexDirection: "row",
        marginTop: 10,
        paddingBottom: 30
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#d1d1d1",
        marginHorizontal: 5,
    },
    paginationDotActive: {
        backgroundColor: "#2F2766",
    },
})