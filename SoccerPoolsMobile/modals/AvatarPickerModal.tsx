import { 
    Modal, View, Text, Pressable, StyleSheet, FlatList, Image, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAvatars } from '../hooks/useAvatars';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { AvatarProps } from '../services/avatarService';
import { colors, spacing, typography, borderRadius } from '../theme';

interface AvatarPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectAvatar: (id: number, imageUrl: string) => void;
    onSelectFromDevice: () => void;
}

export default function AvatarPickerModal({
    visible, onClose, onSelectAvatar, onSelectFromDevice,
}: AvatarPickerModalProps) {
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();
    const { data: avatars, isLoading } = useAvatars();

    const renderAvatar = ({ item }: { item: AvatarProps }) => (
        <Pressable
            style={({ pressed }) => [styles.avatarItem, pressed && styles.avatarItemPressed]}
            onPress={() => {
                onSelectAvatar(item.id, item.image);
                onClose();
            }}
        >
            <Image source={{ uri: item.image }} style={styles.avatarImage} />
        </Pressable>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={[styles.overlay, isLG && styles.overlayLG]}>
                <View style={[styles.modal, isLG && styles.modalLG]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('choose-avatar')}</Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.textMuted} />
                        </Pressable>
                    </View>

                    {isLoading ? (
                        <ActivityIndicator
                            size="large"
                            color={colors.accent}
                            style={styles.loader}
                        />
                    ) : (
                        <FlatList
                            data={avatars}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={renderAvatar}
                            numColumns={3}
                            columnWrapperStyle={styles.row}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    <Pressable
                        style={({ pressed }) => [
                            styles.deviceButton, pressed && styles.deviceButtonPressed
                        ]}
                        onPress={() => {
                            onSelectFromDevice();
                            onClose();
                        }}
                    >
                        <Ionicons name="image-outline" size={20} color={colors.accent} />
                        <Text style={styles.deviceButtonText}>{t('choose-from-device')}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const AVATAR_SIZE = 90;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'flex-end',
    },
    overlayLG: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: colors.backgroundElevated,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.xl,
        maxHeight: '75%',
        borderTopWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    modalLG: {
        borderRadius: borderRadius.xl,
        borderTopWidth: 0,
        borderWidth: 1,
        width: '100%',
        maxWidth: 480,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.headlineSmall,
        fontWeight: typography.fontWeight.bold,
    },
    closeButton: {
        padding: spacing.xs,
    },
    loader: {
        marginVertical: spacing.xxl,
    },
    listContent: {
        paddingBottom: spacing.md,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    avatarItem: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: colors.surfaceBorder,
    },
    avatarItemPressed: {
        borderColor: colors.accent,
        opacity: 0.85,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    deviceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        marginTop: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.accent,
    },
    deviceButtonPressed: {
        backgroundColor: colors.accentMuted,
    },
    deviceButtonText: {
        color: colors.accent,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.medium,
    },
});
