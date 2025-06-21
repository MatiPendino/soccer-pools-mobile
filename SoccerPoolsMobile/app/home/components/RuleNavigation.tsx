import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


export default function RuleNavigation({ 
    data, activeSlide, setActiveSlide, flatListRef, scrollViewRef, screenWidth, scrollX
}) {

    const goToPrevSlide = () => {
        if (activeSlide > 0) {
            const prevIndex = activeSlide - 1

            if (Platform.OS === 'web') {
                scrollViewRef.current?.scrollTo({
                    x: prevIndex * screenWidth,
                    animated: true,
                })
            } else {
                try {
                    flatListRef.current?.scrollToIndex({
                        index: prevIndex,
                        animated: true,
                    })
                } catch (error) {
                    flatListRef.current?.scrollToOffset({
                        offset: prevIndex * screenWidth,
                        animated: true,
                    })
                }
            }
            setActiveSlide(prevIndex)
        }
    };

    const goToNextSlide = () => {
        if (activeSlide < data.length - 1) {
            const nextIndex = activeSlide + 1

            if (Platform.OS === 'web') {
                scrollViewRef.current?.scrollTo({
                    x: nextIndex * screenWidth,
                    animated: true,
                })
            } else {
                try {
                    flatListRef.current?.scrollToIndex({
                        index: nextIndex,
                        animated: true,
                    })
                } catch (error) {
                    flatListRef.current?.scrollToOffset({
                        offset: nextIndex * screenWidth,
                        animated: true,
                    })
                }
            }
            setActiveSlide(nextIndex)
        }
    };

    return (
        <View style={styles.navigationContainer}>
            <TouchableOpacity
                style={[styles.navButton, activeSlide === 0 && styles.navButtonDisabled]}
                onPress={goToPrevSlide}
                disabled={activeSlide === 0}
            >
                <MaterialIcons 
                    name='chevron-left' size={30} 
                    color={activeSlide === 0 ? '#ffffff50' : '#ffffff'} 
                />
            </TouchableOpacity>

            <View style={styles.paginationContainer}>
                {data.map((_, index) => {
                    let scale;
                    let opacity;

                    if (Platform.OS !== 'web') {
                        const inputRange = 
                            [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth];

                        scale = scrollX.interpolate({
                            inputRange,
                            outputRange: [1, 1.5, 1],
                            extrapolate: 'clamp',
                        });

                        opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });
                    } else {
                        // Static values for web
                        scale = index === activeSlide ? 1.5 : 1;
                        opacity = index === activeSlide ? 1 : 0.3;
                    }

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.paginationDot,
                                Platform.OS === 'web' 
                                ? 
                                    {opacity, transform: [{ scale }]}
                                : 
                                    {opacity,transform: [{ scale }]},
                                index === activeSlide && styles.paginationDotActive,
                            ]}
                        />
                    )
                })}
            </View>
            <TouchableOpacity
                style={[styles.navButton, activeSlide === data.length - 1 && styles.navButtonDisabled]}
                onPress={goToNextSlide}
                disabled={activeSlide === data.length - 1}
            >
                <MaterialIcons
                    name='chevron-right'
                    size={30}
                    color={activeSlide === data.length - 1 ? '#ffffff50' : '#ffffff'}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 30,
    },
    navButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#d1d1d1',
        marginHorizontal: 5,
    },
    paginationDotActive: {
        backgroundColor: '#ffffff',
    }
})