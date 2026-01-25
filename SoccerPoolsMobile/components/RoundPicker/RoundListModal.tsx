import { Modal, Text, Pressable, View, StyleSheet, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RoundProps } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../theme';

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
                <View style={styles.header}>
                    <Text style={styles.sheetTitle}>{t('select-round')}</Text>
                    <Pressable
                        onPress={() => setOpen(false)}
                        style={({ pressed }) => [
                            styles.closeButton,
                            pressed && styles.closeButtonPressed
                        ]}
                    >
                        <Ionicons name="close" size={20} color={colors.textPrimary} />
                    </Pressable>
                </View>

                <FlatList
                    data={visibleRounds}
                    keyExtractor={item => item.slug}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        const isActive = index === currentIndex;
                        return (
                            <Pressable
                                onPress={() => {
                                    onChangeRound(index);
                                    setOpen(false);
                                }}
                                style={({ pressed }) => [
                                    styles.item,
                                    isActive && styles.itemActive,
                                    pressed && !isActive && styles.itemPressed
                                ]}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={[styles.itemTxt, isActive && styles.itemTxtActive]}
                                >
                                    {item.name}
                                </Text>
                                {isActive && (
                                    <Ionicons 
                                        name="checkmark-circle" 
                                        size={20} 
                                        color={colors.accent} 
                                    />
                                )}
                            </Pressable>
                        );
                    }}
                    ItemSeparatorComponent={() => <View style={styles.sep} />}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.overlay,
    },
    sheet: {
        position: 'absolute',
        left: spacing.md,
        right: spacing.md,
        top: '18%',
        bottom: '18%',
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    sheetTitle: {
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonPressed: {
        backgroundColor: colors.accent,
    },
    item: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemActive: {
        backgroundColor: colors.accentMuted,
    },
    itemPressed: {
        backgroundColor: colors.surfaceLight,
    },
    itemTxt: {
        fontSize: typography.fontSize.bodyMedium,
        color: colors.textSecondary,
    },
    itemTxtActive: {
        fontWeight: typography.fontWeight.semibold,
        color: colors.accent,
    },
    sep: {
        height: spacing.xs,
    },
});