import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme';

type OrbPosition = 'topRight' | 'topLeft' | 'bottomLeft' | 'bottomRight' | 'center';

interface BackgroundDecorationProps {
    variant?: 'login' | 'create-account';
}

export default function BackgroundDecoration({ variant = 'login' }: BackgroundDecorationProps) {
    const isLogin = variant === 'login';

    return (
        <View style={styles.bgDecoration}>
            <View style={[
                styles.glowOrb,
                styles.glowOrb1,
                isLogin ? styles.orb1Login : styles.orb1CreateAccount
            ]} />
            <View style={[
                styles.glowOrb,
                styles.glowOrb2,
                isLogin ? styles.orb2Login : styles.orb2CreateAccount
            ]} />
            <View style={[
                styles.glowOrb,
                styles.glowOrb3,
                isLogin ? styles.orb3Login : styles.orb3CreateAccount
            ]} />
        </View>
    );
}

const styles = StyleSheet.create({
    bgDecoration: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    glowOrb: {
        position: 'absolute',
        borderRadius: 9999,
        backgroundColor: colors.accent,
    },
    glowOrb1: {
        width: 400,
        height: 400,
        opacity: 0.08,
    },
    glowOrb2: {
        width: 350,
        height: 350,
        opacity: 0.05,
    },
    glowOrb3: {
        width: 200,
        height: 200,
        opacity: 0.03,
    },
    orb1Login: {
        top: -100,
        right: -100,
    },
    orb2Login: {
        bottom: 100,
        left: -150,
    },
    orb3Login: {
        top: '40%',
        right: '20%',
    },
    orb1CreateAccount: {
        top: -100,
        left: -100,
    },
    orb2CreateAccount: {
        bottom: 50,
        right: -150,
    },
    orb3CreateAccount: {
        top: '50%',
        left: '30%',
    },
});
