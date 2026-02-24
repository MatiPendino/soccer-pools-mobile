import { useEffect, useState } from 'react';
import {
    View, TextInput, Text, Pressable, StyleSheet, KeyboardAvoidingView,
    Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { type Router, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Banner, interstitial } from 'components/ads/Ads';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { colors, spacing, typography, borderRadius } from '../theme';
import ImageFormComponent from './ImageFormComponent';

interface TournamentFormProps {
    initialData?: any;
    onSubmit: CallableFunction;
    buttonLabel: string;
    isCreationMode: boolean;
    isLoading: boolean;
}

export default function TournamentForm({
    initialData, onSubmit, buttonLabel, isCreationMode, isLoading,
}: TournamentFormProps) {
    const { t } = useTranslation();
    const [tournamentName, setTournamentName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [logo, setLogo] = useState<string>('');
    const [tournamentType, setTournamentType] = useState<number>(0);
    const { isLG } = useBreakpoint();
    const router: Router = useRouter();

    const handleSubmit = () => {
        onSubmit({ 
            name: tournamentName, description: description, 
            logo: logo, tournamentType: tournamentType 
        });
    };

    const setInitialFormData = () => {
        if (!isCreationMode) {
            if (initialData) {
                setTournamentName(initialData.name);
                setDescription(initialData.description);
                setLogo(initialData.logo);
                setTournamentType(initialData.tournament_type ?? 0);
            }
        }
    };

    interstitial(process.env.CREATE_TOURNAMENT_INTERST_ID);

    useEffect(() => {
        if (!isLoading) {
            setInitialFormData();
        }
    }, [isLoading]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.topBar}>
                <Text style={styles.tntNameTxt}>
                    {initialData ? initialData.name.toString().toUpperCase() : t('create-tournament')}
                </Text>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
                >
                    <Ionicons name="close" color={colors.textPrimary} size={24} />
                </Pressable>
            </View>

            <ScrollView
                style={[styles.scrollView, { width: isLG ? '70%' : '100%' }]}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formGroup}>
                    <Text style={styles.label}>{t('tournament-name')}</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="trophy-outline"
                            size={20}
                            color={colors.textMuted}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.inputTxt}
                            placeholder={t('tournament-name')}
                            placeholderTextColor={colors.textMuted}
                            value={tournamentName}
                            onChangeText={setTournamentName}
                            selectionColor={colors.accent}
                        />
                    </View>
                </View>

                <ImageFormComponent image={logo} setImage={setLogo} />

                <View style={styles.formGroup}>
                    <Text style={styles.label}>{t('description')}</Text>
                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.inputTxt, styles.textArea]}
                            placeholder={t('add-tournament-description')}
                            placeholderTextColor={colors.textMuted}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                            selectionColor={colors.accent}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>{t('tournament-type')}</Text>
                    <View style={styles.segmentedControl}>
                        <Pressable
                            style={[
                                styles.segmentOption,
                                tournamentType === 0 && styles.segmentOptionActive,
                            ]}
                            onPress={() => setTournamentType(0)}
                        >
                            <Ionicons
                                name="lock-open-outline"
                                size={18}
                                color={tournamentType === 0 ? colors.background : colors.textMuted}
                            />
                            <Text style={[
                                styles.segmentText,
                                tournamentType === 0 && styles.segmentTextActive,
                            ]}>
                                {t('public')}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.segmentOption,
                                tournamentType === 1 && styles.segmentOptionActive,
                            ]}
                            onPress={() => setTournamentType(1)}
                        >
                            <Ionicons
                                name="lock-closed-outline"
                                size={18}
                                color={tournamentType === 1 ? colors.background : colors.textMuted}
                            />
                            <Text style={[
                                styles.segmentText,
                                tournamentType === 1 && styles.segmentTextActive,
                            ]}>
                                {t('private')}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <Pressable
                    onPress={() => (!isLoading ? handleSubmit() : {})}
                    style={({ pressed }) => [
                        styles.button,
                        (tournamentName.trim() === '' || isLoading) && styles.buttonDisabled,
                        pressed && !isLoading && tournamentName.trim() !== '' && styles.buttonPressed,
                    ]}
                    disabled={tournamentName.trim() === '' || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={colors.background} size="small" />
                    ) : (
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>{buttonLabel}</Text>
                            <Ionicons name="arrow-forward" size={20} color={colors.background} />
                        </View>
                    )}
                </Pressable>
            </ScrollView>

            <Banner bannerId={process.env.CREATE_TOURNAMENT_BANNER_ID} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    scrollView: {
        flex: 1,
        marginHorizontal: 'auto',
    },
    topBar: {
        backgroundColor: colors.backgroundElevated,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        marginTop: Platform.OS === 'web' ? 0 : 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonPressed: {
        backgroundColor: colors.backgroundCard,
    },
    contentContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxxl,
    },
    tntNameTxt: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    formGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.labelMedium,
        fontWeight: typography.fontWeight.medium,
        marginBottom: spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.surfaceBorder,
        borderRadius: borderRadius.md,
        backgroundColor: colors.backgroundInput,
        overflow: 'hidden',
    },
    inputIcon: {
        marginLeft: spacing.md,
    },
    inputTxt: {
        flex: 1,
        padding: spacing.md,
        color: colors.textPrimary,
        fontSize: typography.fontSize.bodyMedium,
        ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
    },
    textAreaContainer: {
        height: 120,
        alignItems: 'flex-start',
    },
    textArea: {
        height: '100%',
    },
    segmentedControl: {
        flexDirection: 'row',
        borderWidth: 1.5,
        borderColor: colors.surfaceBorder,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    segmentOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        gap: spacing.xs,
        backgroundColor: colors.backgroundInput,
    },
    segmentOptionActive: {
        backgroundColor: colors.accent,
    },
    segmentText: {
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textMuted,
    },
    segmentTextActive: {
        color: colors.background,
    },
    button: {
        backgroundColor: colors.accent,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginTop: spacing.md,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: colors.surfaceLight,
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    buttonText: {
        color: colors.background,
        fontWeight: typography.fontWeight.semibold,
        fontSize: typography.fontSize.bodyMedium,
    },
});
