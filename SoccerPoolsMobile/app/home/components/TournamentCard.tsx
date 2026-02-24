import { View, StyleSheet, Text, Image, ActivityIndicator, Pressable } from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { Router, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useJoinTournament } from '../../../hooks/useTournaments';
import { Email } from '../../../types';
import { colors, spacing, typography, borderRadius } from '../../../theme';

interface TournamentCardProps {
    name: string;
    logoUrl: string;
    nParticipants: number;
    adminEmail: Email;
    adminUsername: string;
    tournamentId: number;
    leagueId: number;
    currentUserState: 0 | 1 | 2 | 3 | null;
    tournamentType: 0 | 1;
}

export default function TournamentCard({
    name, logoUrl, nParticipants, adminEmail, adminUsername,
    tournamentId, leagueId, currentUserState, tournamentType,
}: TournamentCardProps) {
    const { t } = useTranslation();
    const { mutate: joinMutate, isPending: isJoining } = useJoinTournament();
    const toast: ToastType = useToast();
    const router: Router = useRouter();

    const isPublic: boolean = tournamentType === 0;

    const getStateInfo = () => {
        if (currentUserState === null || currentUserState === undefined) {
            return {
                color: colors.success,
                bgColor: colors.successBg,
                text: isPublic ? t('join') : t('apply'),
                icon: 'add-circle-outline'
            };
        }

        switch (currentUserState) {
            case 0:
                return {
                    color: colors.success, bgColor: colors.successBg,
                    text: isPublic ? t('join') : t('apply'), icon: 'add-circle-outline'
                };
            case 1:
                return {
                    color: colors.warning, bgColor: colors.warningBg,
                    text: t('pending'), icon: 'hourglass-outline'
                };
            case 2:
                return {
                    color: colors.accent, bgColor: colors.accentMuted,
                    text: t('joined'), icon: 'checkmark-circle-outline'
                };
            case 3:
                return {
                    color: colors.error, bgColor: colors.errorBg,
                    text: t('rejected'), icon: 'close-circle-outline'
                };
            default:
                return {
                    color: colors.success, bgColor: colors.successBg,
                    text: isPublic ? t('join') : t('apply'), icon: 'add-circle-outline'
                };
        }
    };

    const tournamentStateConversion = () => {
        const stateInfo = getStateInfo();

        return (
            <View style={[styles.stateContainer, { backgroundColor: stateInfo.bgColor }]}>
                <Ionicons name={stateInfo.icon as any} size={16} color={stateInfo.color} />
                <Text style={[styles.stateTxt, { color: stateInfo.color }]}>
                    {stateInfo.text}
                </Text>
            </View>
        );
    };

    const handleJoin = () => {
        joinMutate(tournamentId, {
            onSuccess: () => {
                if (isPublic) {
                    toast.show(t('joined-successfully'), { type: 'success' });
                    router.push(`my-tournament/${tournamentId}`);
                } else {
                    toast.show(t('join-request-sent'), { type: 'success' });
                }
            },
            onError: () => {
                toast.show(t('already-requested'), { type: 'warning' });
            }
        });
    };

    const handleCard = () => {
        if (
            currentUserState === null || currentUserState === undefined || currentUserState === 0
        ) {
            handleJoin();
            return;
        }

        switch (currentUserState) {
            case 1:
                toast.show(t('already-request-sent'), { type: 'warning' });
                break;
            case 2:
                router.push(`my-tournament/${tournamentId}`);
                break;
            case 3:
                toast.show(t('request-rejected'), { type: 'error' });
                break;
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed
            ]}
            onPress={handleCard}
        >
            <View style={styles.contentContainer}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    {logoUrl ? (
                        <Image source={{ uri: `${logoUrl}` }} style={styles.logoImg} />
                    ) : (
                        <View style={styles.placeholderLogo}>
                            <Text style={styles.placeholderText}>{name.charAt(0)}</Text>
                        </View>
                    )}
                </View>

                {/* Info */}
                <View style={styles.textsContainer}>
                    <View style={styles.nameRow}>
                        <Ionicons
                            name={isPublic ? 'lock-open-outline' : 'lock-closed-outline'}
                            size={14}
                            color={colors.textMuted}
                        />
                        <Text 
                            style={styles.tournamentNameTxt} 
                            numberOfLines={1} ellipsizeMode='tail'
                        >
                            {name}
                        </Text>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name='person-outline' size={14} color='#DDDDDD' />
                            <Text style={styles.metaTxt} numberOfLines={1} ellipsizeMode='tail'>
                                {adminUsername}
                            </Text>
                        </View>

                        <View style={styles.metaItem}>
                            <Ionicons name='people-outline' size={14} color='#DDDDDD' />
                            <Text style={styles.metaTxt}>
                                {nParticipants}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* State Badge */}
            <View style={styles.stateWrapper}>
                {!isJoining ? (
                    tournamentStateConversion()
                ) : (
                    <ActivityIndicator size='small' color={colors.accent} />
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.backgroundCard,
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        flex: 1,
    },
    pressed: {
        backgroundColor: colors.surfaceLight,
        transform: [{ scale: 0.98 }],
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    logoContainer: {
        marginRight: spacing.md,
    },
    logoImg: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.white,
    },
    placeholderLogo: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textMuted,
    },
    textsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    tournamentNameTxt: {
        fontSize: typography.fontSize.titleSmall,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
        flex: 1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    metaTxt: {
        color: '#DDDDDD',
        fontSize: typography.fontSize.labelMedium,
    },
    stateWrapper: {
        marginLeft: spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
    stateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        gap: spacing.xs,
    },
    stateTxt: {
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.semibold,
    },
});