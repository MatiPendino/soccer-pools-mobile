import { View, StyleSheet, Text, Image, ActivityIndicator, Pressable } from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { Router, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTournamentUser, useUpdateStateTournamentUser } from '../../../hooks/useTournaments';
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
}

export default function TournamentCard({
    name, logoUrl, nParticipants, adminEmail, adminUsername, tournamentId, leagueId,
}: TournamentCardProps) {
    const { t } = useTranslation();
    const { data: tournamentUser, isLoading: isUserLoading } = useTournamentUser(tournamentId);
    const { mutate: updateState, isPending: isUpdating } = useUpdateStateTournamentUser();
    const toast: ToastType = useToast();
    const router: Router = useRouter();

    const getStateInfo = () => {
        if (!tournamentUser) {
            return {
                color: colors.success,
                bgColor: colors.successBg,
                text: t('apply'),
                icon: 'add-circle-outline'
            };
        }

        switch (tournamentUser.tournament_user_state) {
            case 0:
                return { 
                    color: colors.success, bgColor: colors.successBg, 
                    text: t('apply'), icon: 'add-circle-outline' 
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
                    text: t('apply'), icon: 'add-circle-outline' 
                };
        }
    };

    const tournamentStateConversion = () => {
        const stateInfo = getStateInfo();

        return (
            <View style={[styles.stateContainer, { backgroundColor: stateInfo.bgColor }]}>
                <Ionicons name={stateInfo.icon as any} size={16} color={stateInfo.color} />
                <Text style={[styles.stateTxt, { color: stateInfo.color }]}>{stateInfo.text}</Text>
            </View>
        );
    };

    const joinTournament = () => {
        if (!tournamentUser) return;
        updateState({tournamentUserId: tournamentUser.id, tournamentState: 1}, {
            onSuccess: () => {
                toast.show(t('join-request-sent'), { type: 'success' });
            },
            onError: () => {
                toast.show('There is been an error sending the join request', { type: 'error' });
            }
        });
    };

    const handleCard = () => {
        if (!tournamentUser) return;

        switch (tournamentUser.tournament_user_state) {
            case 0:
                joinTournament();
                break;
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
                    <Text style={styles.tournamentNameTxt} numberOfLines={1} ellipsizeMode='tail'>
                        {name}
                    </Text>

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
                {(!isUserLoading && !isUpdating) ? (
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
    tournamentNameTxt: {
        fontSize: typography.fontSize.titleSmall,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
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