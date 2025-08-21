import { Modal, Text, Pressable, View, StyleSheet, FlatList, Platform } from 'react-native';
import { RoundProps } from '../../types';
import { useTranslation } from 'react-i18next';

interface Props {
    setOpen: (open: boolean) => void;
    onChangeRound: (index: number) => void;
    open: boolean;
    visibleRounds: RoundProps[];
    currentIndex: number;
}

export default function RoundListModal({ 
    setOpen, onChangeRound, open, visibleRounds, currentIndex
}: Props) {
    const { t } = useTranslation();

    return (
        <Modal
            visible={open}
            animationType={Platform.OS === 'web' ? 'none' : 'slide'}
            transparent
            onRequestClose={() => setOpen(false)}
        >
            <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
            <View style={styles.sheet}>
                <Text style={styles.sheetTitle}>{t('select-round')}</Text>
                <FlatList
                    data={visibleRounds}
                    keyExtractor={item => item.slug}
                    renderItem={({ item, index }) => {
                        const isActive = index === currentIndex;
                        return (
                            <Pressable
                                onPress={() => {
                                    onChangeRound(index);
                                    setOpen(false);
                                }}
                                style={[styles.item, isActive && styles.itemActive]}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={[styles.itemTxt, isActive && styles.itemTxtActive]}
                                >
                                    {item.name}
                                </Text>
                            </Pressable>
                        )
                    }}
                    ItemSeparatorComponent={() => <View style={styles.sep} />}
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    sheet: {
        position: 'absolute',
        left: 14,
        right: 14,
        top: '18%',
        bottom: '18%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 14,
        elevation: 5,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    sheetTitle: { 
        fontSize: 16, 
        fontWeight: '700', 
        marginBottom: 8 
    },
    item: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    itemActive: {
        backgroundColor: '#f0f3ff',
    },
    itemTxt: { 
        fontSize: 15 
    },
    itemTxtActive: { 
        fontWeight: '700' 
    },
    sep: { 
        height: 6 
    }
});