import { View, Text, Modal, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../../../theme';
import CoinPill from './CoinPill';
import GradientButton from './GradientButton';

type Props = {
    visible: boolean;
    onClose: () => void;
    title: string;
    imageUri: string;
    prizeId: number;
    coinsLabel: string;
    description?: string;
    width: number;
    onClaim: (prizeId: number) => void;
    buttonLabel: string;
    isClaiming: boolean;
};

export default function ModalInfo({
    visible, onClose, title, imageUri, coinsLabel, description, width, onClaim,
    buttonLabel, prizeId, isClaiming
}: Props) {
    return (
        <Modal transparent visible={visible} animationType='fade' onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <View style={[styles.sheet, { width: Math.min(width, 560) }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title} numberOfLines={2}>{title}</Text>
                        <Pressable
                            onPress={onClose}
                            hitSlop={8}
                            style={({ pressed }) => [
                                styles.closeButton,
                                pressed && styles.closeButtonPressed
                            ]}
                        >
                            <Ionicons name='close' size={20} color={colors.textPrimary} />
                        </Pressable>
                    </View>

                    {/* Hero Image */}
                    <View style={styles.hero}>
                        <View style={styles.surface}>
                            <Image 
                                source={{ uri: imageUri }} 
                                style={styles.img} 
                                resizeMode='contain' 
                            />
                        </View>
                    </View>

                    {/* Coins */}
                    <View style={styles.meta}>
                        <CoinPill text={coinsLabel} />
                    </View>

                    {/* Description */}
                    <ScrollView contentContainerStyle={styles.body}>
                        {!!description && <Text style={styles.description}>{description}</Text>}
                    </ScrollView>

                    {/* CTA */}
                    <GradientButton
                        title={buttonLabel}
                        onPress={() => {
                            onClose();
                            onClaim(prizeId);
                        }}
                        prizeId={prizeId}
                        style={styles.cta}
                        isClaiming={isClaiming}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'flex-end',
        padding: spacing.md,
    },
    sheet: {
        alignSelf: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        width: '90%',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    title: {
        flex: 1,
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
    hero: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    surface: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    img: {
        width: '100%',
        height: '100%',
    },
    meta: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xs,
        paddingBottom: spacing.sm,
    },
    body: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    description: {
        fontSize: typography.fontSize.bodyMedium,
        lineHeight: 22,
        color: colors.textSecondary,
    },
    cta: {
        marginHorizontal: 'auto',
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
});
