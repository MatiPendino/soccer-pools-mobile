import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { ISO8601DateString } from '../../../types';
import { colors, spacing, typography, borderRadius } from '../../../theme';

interface MatchResultTopProps {
    matchState: number;
    points: number;
    startDate: ISO8601DateString;
}

export default function MatchResultTop({ matchState, points, startDate }: MatchResultTopProps) {
    const { t } = useTranslation();

    const addLeftZero = (num: number): string => {
        if (num < 10) {
            return `0${num}`;
        }
        return num.toString();
    };

    const formatDate = (): string => {
        if (!startDate) {
            return t('undefined-date');
        }
        const isoDate = new Date(startDate);
        const localMonth = addLeftZero(isoDate.getMonth() + 1);
        const localDay = addLeftZero(isoDate.getDate());
        const localHours = addLeftZero(isoDate.getHours());
        const localMinutes = addLeftZero(isoDate.getMinutes());

        return `${localHours}:${localMinutes} - ${localDay}/${localMonth}`;
    };

    const handleResultText = () => {
        switch (matchState) {
            case 0:
                return formatDate();
            case 1:
                return t('pending');
            case 2:
                return t('finalized');
            case 3:
                return t('cancelled');
            case 4:
                return t('postponed');
            case 5:
                return t('preplayed');
        }
    };

    const getStatusStyle = () => {
        switch (matchState) {
            case 0:
                return { bg: colors.accentMuted, color: colors.accent };
            case 1:
                return { bg: colors.warningBg, color: colors.warning };
            case 2:
                return { bg: colors.successBg, color: colors.success };
            case 3:
            case 4:
                return { bg: colors.errorBg, color: colors.error };
            default:
                return { bg: colors.accentMuted, color: colors.accent };
        }
    };

    const statusStyle = getStatusStyle();

    return (
        <View style={styles.topContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.topTxt, { color: statusStyle.color }]}>
                    {handleResultText()}
                </Text>
            </View>

            {matchState !== 0 && (
                <View style={styles.pointsContainer}>
                    <Text style={styles.pointsTxt}>{points} pts</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: spacing.sm,
        marginBottom: spacing.sm,
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    topTxt: {
        fontSize: typography.fontSize.labelMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    pointsContainer: {
        backgroundColor: colors.accent,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
    pointsTxt: {
        fontSize: typography.fontSize.labelMedium,
        color: colors.background,
        fontWeight: typography.fontWeight.bold,
    },
});