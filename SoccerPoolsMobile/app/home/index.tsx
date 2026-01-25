import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { colors, spacing, typography, borderRadius } from '../../theme';
import Leaderboard from './tabs/Leaderboard';
import Results from './tabs/Results';
import Tournaments from './tabs/Tournaments';

const Tab = createBottomTabNavigator();

export default function League() {
    const { isSM, isMD } = useBreakpoint();
    const isMobile = isSM || isMD;

    return (
        <NavigationIndependentTree>
            <NavigationContainer>
                <Tab.Navigator
                    id={undefined}
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color }) => {
                            let iconName: keyof typeof Ionicons.glyphMap;

                            if (route.name === 'Results') {
                                iconName = focused ? 'trophy' : 'trophy-outline';
                            } else if (route.name === 'Leaderboard') {
                                iconName = focused ? 'podium' : 'podium-outline';
                            } else if (route.name === 'Tournaments') {
                                iconName = focused ? 'people' : 'people-outline';
                            }

                            return (
                                <View style={[
                                    styles.iconContainer,
                                    focused && styles.iconContainerActive,
                                    isMobile && styles.iconContainerMobile
                                ]}>
                                    <Ionicons name={iconName} size={22} color={color} />
                                </View>
                            );
                        },
                        headerShown: false,
                        tabBarActiveTintColor: colors.accent,
                        tabBarInactiveTintColor: colors.textMuted,
                        tabBarStyle: [
                            styles.tabBar,
                            isMobile && styles.tabBarMobile
                        ],
                        tabBarLabelStyle: styles.tabBarLabel,
                        tabBarItemStyle: [
                            styles.tabBarItem,
                            isMobile && styles.tabBarItemMobile
                        ],
                    })}
                >
                    <Tab.Screen name="Results">{() => <Results />}</Tab.Screen>
                    <Tab.Screen name="Leaderboard">{() => <Leaderboard />}</Tab.Screen>
                    <Tab.Screen name="Tournaments">{() => <Tournaments />}</Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        </NavigationIndependentTree>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.backgroundElevated,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceBorder,
        height: 70,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
    },
    tabBarMobile: {
        height: 80,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    tabBarLabel: {
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.medium,
        marginTop: spacing.xs,
    },
    tabBarItem: {
        paddingVertical: spacing.xs,
    },
    tabBarItemMobile: {
        paddingVertical: spacing.sm,
    },
    iconContainer: {
        padding: spacing.sm,
        borderRadius: borderRadius.md,
    },
    iconContainerMobile: {
        padding: spacing.xs,
    },
    iconContainerActive: {
        backgroundColor: colors.accentMuted,
    },
});
