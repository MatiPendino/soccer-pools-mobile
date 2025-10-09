import { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MAIN_COLOR } from '../constants';
import { resetPassword } from '../services/authService';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal ({ visible, onClose }: Props) {
    const { t } = useTranslation();
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleResetPassword = async () => {
        try {
            setLoading(true);
            await resetPassword(email);
            Alert.alert(t('success'), t('check-email-password-link'));
            setEmail('');
            onClose();
        } catch (error) {
            Alert.alert('Error', t('couldnt-send-reset-email'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType='slide'>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{t('forgot-password')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Email'
                        onChangeText={setEmail}
                        value={email}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />

                    <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? t('sending') : t('send-reset-link')}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelText}>{t('cancel')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        alignItems: 'center',
        elevation: 10,
    },
    title: {
        fontSize: 20,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 12,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
    },
    button: {
        backgroundColor: MAIN_COLOR,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelText: {
        color: '#888',
        marginTop: 10,
    },
})
