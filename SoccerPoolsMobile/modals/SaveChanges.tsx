import { Modal, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MAIN_COLOR } from '../constants';
import { useResultsContext } from '../app/home/contexts/ResultsContext';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { Slug } from 'types';

interface Props {
    visible: boolean;
    onClose: () => void;
    savePredictions: () => Promise<void>;
    isLoading: boolean;
    nextRoundId: number;
    nextRoundSlug: Slug;
    handleRoundSwap: (roundId: number, roundSlug: Slug, alreadyShowedModal?: boolean) => Promise<void>;
}

export default function SaveChanges({
    visible, onClose, savePredictions, isLoading, nextRoundId, nextRoundSlug, handleRoundSwap
}: Props) {
    const { t } = useTranslation();
    const { setArePredictionsSaved } = useResultsContext();
    const { isXL } = useBreakpoint();

    const onSave = async (): Promise<void> => {
        await savePredictions();
        await handleRoundSwap(nextRoundId, nextRoundSlug, true);
        onClose();
    }

    const onDontSave = async (): Promise<void> => {
        await handleRoundSwap(nextRoundId, nextRoundSlug, true);
        setArePredictionsSaved(true);
        onClose();
    }

    return (
        <Modal visible={visible} transparent animationType='slide'>
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { width: isXL ? '60%' : '85%' }]}>
                    <Text style={[styles.title, {fontSize: isXL ? 20 : 17}]}>{t('you-havent-saved')}</Text>

                    <TouchableOpacity style={styles.button} onPress={onSave} disabled={isLoading}>
                        <Text style={styles.buttonText}>{isLoading ? t('saving') : t('save-predictions')}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={onDontSave}>
                        <Text style={styles.cancelText}>{t('dont-save')}</Text>
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
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        alignItems: 'center',
        elevation: 10,
    },
    title: {
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
});