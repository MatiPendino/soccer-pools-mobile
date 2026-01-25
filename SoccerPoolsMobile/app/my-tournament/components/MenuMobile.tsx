import { View, Pressable, StyleSheet } from 'react-native';
import { Menu } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { TournamentProps } from 'types';
import { colors, borderRadius } from '../../../theme';

interface MenuMobileProps {
    tournament: TournamentProps;
    t: (key: string) => string;
    handleTournamentClick: (slug: string) => void;
    isMenuVisible: boolean;
    setIsMenuVisible: (visible: boolean) => void;
    handleShare: () => void;
}

export default function MenuMobile({
    tournament, t, handleTournamentClick, isMenuVisible, setIsMenuVisible, handleShare
}: MenuMobileProps) {

    return (
        <View>
            <Menu
                visible={isMenuVisible}
                onDismiss={() => setIsMenuVisible(false)}
                contentStyle={styles.menuContent}
                anchor={
                    <Pressable
                        onPress={() => setIsMenuVisible(true)}
                        style={({ pressed }) => [
                            styles.menuButton,
                            pressed && styles.menuButtonPressed
                        ]}
                    >
                        <Ionicons name="ellipsis-vertical" color={colors.textPrimary} size={20} />
                    </Pressable>
                }
            >
                <Menu.Item
                    onPress={handleShare}
                    title={t('invite-friends')}
                    leadingIcon={() => <Ionicons name="share-social-outline" size={20} color={colors.textPrimary} />}
                    titleStyle={styles.menuItemText}
                />

                {tournament.is_current_user_admin && (
                    <View>
                        <Menu.Item
                            onPress={() => handleTournamentClick('pending-invites')}
                            title={t('pending-invites')}
                            leadingIcon={() => <Ionicons name="hourglass-outline" size={20} color={colors.textPrimary} />}
                            titleStyle={styles.menuItemText}
                        />
                        <Menu.Item
                            onPress={() => handleTournamentClick('edit-tournament')}
                            title={t('tournament-settings')}
                            leadingIcon={() => <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />}
                            titleStyle={styles.menuItemText}
                        />
                    </View>
                )}
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuButtonPressed: {
        backgroundColor: colors.accent,
    },
    menuContent: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
    },
    menuItemText: {
        color: colors.textPrimary,
    },
});