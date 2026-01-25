
export const colors = {
    // Brand Accent
    accent: '#00D4AA',
    accentLight: '#33DDBB',
    accentDark: '#00A88A',
    accentMuted: 'rgba(0, 212, 170, 0.15)',

    // Dark Background Scale
    background: '#0A0A0F',
    backgroundElevated: '#12121A',
    backgroundCard: '#1A1A24',
    backgroundInput: '#22222E',

    // Surface colors for layering
    surface: '#1E1E28',
    surfaceLight: '#2A2A36',
    surfaceBorder: '#2E2E3A',

    // Text Hierarchy
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0B0',
    textMuted: '#6B6B7B',
    textDisabled: '#4A4A58',

    // Semantic Colors
    success: '#00C853',
    successLight: '#69F0AE',
    successBg: 'rgba(0, 200, 83, 0.12)',

    warning: '#FFB300',
    warningLight: '#FFD54F',
    warningBg: 'rgba(255, 179, 0, 0.12)',

    error: '#FF5252',
    errorLight: '#FF8A80',
    errorBg: 'rgba(255, 82, 82, 0.12)',

    info: '#448AFF',
    infoLight: '#82B1FF',

    // Coins/Rewards
    coins: '#FFD700',
    coinsBg: 'rgba(255, 215, 0, 0.12)',

    // Medal Colors
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',

    // Utility
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.4)',

    // Legacy mappings for compatibility
    primary: '#00D4AA',
    primaryLight: '#33DDBB',
    primaryDark: '#12121A',
    primaryDarker: '#0A0A0F',
    primarySurface: '#1A1A24',
    primaryBackground: '#0A0A0F',
    gray100: '#F5F5F5',
    gray200: '#E5E5E5',
    gray300: '#A0A0B0',
    gray400: '#6B6B7B',
    gray500: '#4A4A58',
    gray600: '#2E2E3A',
    gray700: '#22222E',
    gray800: '#1A1A24',
    gray900: '#12121A',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#A0A0B0',
} as const;

export const typography = {
    fontFamily: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
    },

    // Slightly larger, more readable sizes
    fontSize: {
        displayLarge: 36,
        displayMedium: 30,
        displaySmall: 26,
        headlineLarge: 24,
        headlineMedium: 22,
        headlineSmall: 20,
        titleLarge: 18,
        titleMedium: 16,
        titleSmall: 14,
        bodyLarge: 16,
        bodyMedium: 15,
        bodySmall: 13,
        labelLarge: 14,
        labelMedium: 12,
        labelSmall: 11,
    },

    lineHeight: {
        displayLarge: 44,
        displayMedium: 38,
        displaySmall: 34,
        headlineLarge: 32,
        headlineMedium: 30,
        headlineSmall: 28,
        titleLarge: 26,
        titleMedium: 24,
        titleSmall: 20,
        bodyLarge: 24,
        bodyMedium: 22,
        bodySmall: 18,
        labelLarge: 20,
        labelMedium: 18,
        labelSmall: 16,
    },

    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },

    // Letter spacing for cleaner look
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
    },
} as const;

// More generous spacing for breathing room
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
} as const;

// Softer, more modern border radius
export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    full: 9999,
} as const;

// Subtle shadows for dark theme
export const shadows = {
    sm: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
    },
    md: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 8,
    },
    // Glow effect for accent elements
    glow: {
        shadowColor: '#00D4AA',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 0,
    },
} as const;

const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
};

export default theme;
