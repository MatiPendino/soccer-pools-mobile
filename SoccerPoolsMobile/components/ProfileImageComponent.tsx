import { useState } from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../hooks/useBreakpoint';
import AvatarPickerModal from '../modals/AvatarPickerModal';
import { colors, borderRadius } from '../theme';

interface ProfileImageComponentProps {
    image: string;
    setImage: (uri: string) => void;
    setAvatarId: (id: number | null) => void;
}

export default function ProfileImageComponent({ 
    image, setImage, setAvatarId 
}: ProfileImageComponentProps) {
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const size = isLG ? 400 : 220;

    const handleSelectAvatar = (id: number, imageUrl: string) => {
        setImage(imageUrl);
        setAvatarId(id);
    };

    const handleSelectFromDevice = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert(t('permission-media-required'));
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setAvatarId(null);
        }
    };

    return (
        <>
            <Pressable onPress={() => setModalVisible(true)}>
                {image ? (
                    <View style={[styles.imageContainer, { width: size, height: size }]}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <View style={styles.editButton}>
                            <Feather name="edit-2" size={16} color="white" />
                        </View>
                    </View>
                ) : (
                    <View style={[styles.placeholder, { width: size, height: size }]}>
                        <Feather name="user" size={48} color={colors.textMuted} />
                        <View style={styles.editButton}>
                            <Feather name="edit-2" size={16} color="white" />
                        </View>
                    </View>
                )}
            </Pressable>

            <AvatarPickerModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelectAvatar={handleSelectAvatar}
                onSelectFromDevice={handleSelectFromDevice}
            />
        </>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        position: 'relative',
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: borderRadius.full,
        objectFit: 'cover',
    },
    placeholder: {
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    editButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(47, 39, 102, 0.8)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
