import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function ImageFormComponent({image, setImage}) {
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();

    const pickImage = async () => {
        // Request permission to access the media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert(t('permission-media-required'));
            return
        }

        // Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        } else {
            alert(t('no-image-selected'));
        }
    }

    return (
        <View style={styles.formGroup}>
            <Text style={styles.label}>{t('add-tournament-image')}</Text>
            {
                image 
                ? 
                <View style={[styles.logoContainer, {
                    height: isLG ? 400 : 220,
                    width: isLG ? 400 : 220
                    }]}
                >
                    <Image source={{ uri: image }} style={styles.logoPreview} />
                    <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
                        <Feather name='edit-2' size={16} color='white' />
                    </TouchableOpacity>
                </View>
                : 
                <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                    <Feather name='image' size={24} color='white' />
                    <Text style={styles.imagePickerText}>{t('add-tournament-image')}</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    formGroup: {
        marginBottom: 24,
    },
    label: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        opacity: 0.9,
    },
    imagePickerButton: {
        height: 120,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 200,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePickerText: {
        color: 'white',
        marginTop: 8,
        opacity: 0.8,
    },
    logoContainer: {
        position: 'relative',
        borderRadius: 200,
    },
    logoPreview: {
        objectFit: 'cover',
        height: '100%',
        borderRadius: 200,
    },
    changeImageButton: {
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
})