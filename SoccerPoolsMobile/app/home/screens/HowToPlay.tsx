import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Dimensions, ScaledSize, TouchableOpacity, Animated } from 'react-native';
import { MAIN_COLOR } from '../../../constants';
import { MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth }: ScaledSize = Dimensions.get('window');

export default function HowToPlay({}) {
    const { t } = useTranslation()
    const [activeSlide, setActiveSlide] = useState<number>(0)
    const flatListRef = useRef(null)
    const scrollX = useRef(new Animated.Value(0)).current

    // Icons for each rule 
    const icons = [
        'emoji-events',
        'groups',      
        'sports-soccer',
        'leaderboard', 
        'emoji-flags', 
    ]

    const data = [
        { id: 1, text: t('htp-1'), icon: icons[0] },
        { id: 2, text: t('htp-2'), icon: icons[1] },
        { id: 3, text: t('htp-3'), icon: icons[2] },
        { id: 4, text: t('htp-4'), icon: icons[3] },
        { id: 5, text: t('htp-5'), icon: icons[4] },
    ]

    const goToNextSlide = () => {
        if (activeSlide < data.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: activeSlide + 1,
                animated: true,
            });
        }
    };

    const goToPrevSlide = () => {
        if (activeSlide > 0) {
            flatListRef.current?.scrollToIndex({
                index: activeSlide - 1,
                animated: true,
            });
        }
    };

    const renderItem = ({ item, index }) => {
        const inputRange = [ (index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View 
                style={[
                styles.slide,
                { transform: [{ scale }], opacity }
                ]}
            >
                <View style={styles.ruleCard}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name={item.icon} size={48} color='#fff' />
                    </View>
                    <Text style={styles.ruleNumber}>{t('rule')} {item.id}</Text>
                    <Text style={styles.ruleTxt}>{item.text}</Text>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('how-to-play')}</Text>
                <Text style={styles.headerSubtitle}>{t('swipe-to-learn')}</Text>
            </View>

            <Animated.FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
                )}
                onMomentumScrollEnd={(event) => {
                const index = Math.round(
                    event.nativeEvent.contentOffset.x / screenWidth
                );
                setActiveSlide(index);
                }}
                keyExtractor={(item) => item.id.toString()}
                scrollEventThrottle={16}
                decelerationRate='fast'
                snapToInterval={screenWidth}
            />

            <View style={styles.navigationContainer}>
                <TouchableOpacity 
                    style={[styles.navButton, activeSlide === 0 && styles.navButtonDisabled]} 
                    onPress={goToPrevSlide}
                    disabled={activeSlide === 0}
                >
                    <MaterialIcons 
                        name='chevron-left' 
                        size={30} 
                        color={activeSlide === 0 ? '#ffffff50' : '#ffffff'} 
                    />
                </TouchableOpacity>

                <View style={styles.paginationContainer}>
                    {data.map((_, index) => {
                        const inputRange = [
                            (index - 1) * screenWidth,
                            index * screenWidth,
                            (index + 1) * screenWidth,
                        ];
                        
                        // Instead of animating width, we'll animate scale
                        const scale = scrollX.interpolate({
                            inputRange,
                            outputRange: [1, 1.5, 1],
                            extrapolate: 'clamp',
                        });
                        
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });
                        
                        return (
                            <Animated.View
                                key={index}
                                style={[
                                styles.paginationDot,
                                { 
                                    opacity,
                                    transform: [{ scale }]
                                },
                                index === activeSlide && styles.paginationDotActive,
                                ]}
                            />
                        );
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

            <View style={styles.progressText}>
                <Text style={styles.progressTextContent}>{activeSlide + 1} {t('of')} {data.length}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAIN_COLOR,
        paddingBottom: 20,
        paddingTop: 5
    },
    header: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: 'white',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 10,
    },
    slide: {
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    ruleCard: {
        backgroundColor: '#2F2766',
        borderRadius: 20,
        padding: 30,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    ruleNumber: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    ruleTxt: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 28,
    },
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
    },
    progressText: {
        alignItems: 'center',
        marginTop: 20,
    },
    progressTextContent: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
});