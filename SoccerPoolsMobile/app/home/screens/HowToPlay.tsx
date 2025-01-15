import { useState } from "react"
import { useTranslation } from "react-i18next"
import { View, Text, StyleSheet, Dimensions, FlatList, ScaledSize } from "react-native"

const { width: screenWidth }: ScaledSize = Dimensions.get("window")

export default function HowToPlay({}) {
    const { t } = useTranslation()
    const [activeSlide, setActiveSlide] = useState<number>(0)

    const data = [
        { id: 1, text: t('htp-1') },
        { id: 2, text: t('htp-2') },
        { id: 3, text: t('htp-3') },
        { id: 4, text: t('htp-4') },
        { id: 5, text: t('htp-5') },
    ]

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