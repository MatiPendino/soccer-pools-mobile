import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    View, Text, StyleSheet, Dimensions, ScaledSize, Animated, ScrollView, Platform
} from 'react-native';
import { MAIN_COLOR } from '../../../constants';
import RuleCard from '../components/RuleCard';
import RuleNavigation from '../components/RuleNavigation';

const { width: screenWidth }: ScaledSize = Dimensions.get('window');

export default function HowToPlay({}) {
    const { t } = useTranslation()
    const [activeSlide, setActiveSlide] = useState<number>(0)
    const flatListRef = useRef<any>(null)
    const scrollViewRef = useRef<ScrollView>(null)
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

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x
        const index = Math.round(contentOffsetX / screenWidth)

        // Update active slide based on scroll position
        if (index !== activeSlide && index >= 0 && index < data.length) {
            setActiveSlide(index)
        }
    }

    const renderMobileSlides = ({ item, index }) => {
        return (
            <RuleCard
                item={item}
                index={index}
                screenWidth={screenWidth}
                scrollX={scrollX}
                t={t}
            />
        );
    }

    const renderWebSlides = () => {
        return data.map((item, index) => (
            <RuleCard
                key={item.id}
                item={item}
                index={index}
                screenWidth={screenWidth}
                scrollX={scrollX}
                t={t}
            />
        ))
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('how-to-play')}</Text>
                <Text style={styles.headerSubtitle}>
                    {Platform.OS === 'web' ? t('click-arrows-to-navigate') : t('swipe-to-learn')}
                </Text>
            </View>

            {Platform.OS === 'web' ? (
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    decelerationRate='fast'
                    snapToInterval={screenWidth}
                    snapToAlignment='start'
                    style={styles.scrollContainer}
                >
                    {renderWebSlides()}
                </ScrollView>
            ) : (
                <Animated.FlatList
                    ref={flatListRef}
                    data={data}
                    renderItem={renderMobileSlides}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: true,
                        listener: handleScroll,
                    })}
                    onMomentumScrollEnd={handleScroll}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEventThrottle={16}
                    decelerationRate='fast'
                    snapToInterval={screenWidth}
                    getItemLayout={(data, index) => ({
                        length: screenWidth,
                        offset: screenWidth * index,
                        index,
                    })}
                />
            )}

            <RuleNavigation
                data={data}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
                scrollViewRef={scrollViewRef}
                flatListRef={flatListRef}
                screenWidth={screenWidth}
                scrollX={scrollX}
            />

            <View style={styles.progressText}>
                <Text style={styles.progressTextContent}>
                    {activeSlide + 1} {t('of')} {data.length}
                </Text>
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
    scrollContainer: {
        flexGrow: 1,
        width: '100%',
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