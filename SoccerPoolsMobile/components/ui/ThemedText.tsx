import { Text, TextStyle } from 'react-native';
import { colors, typography } from '../../theme';

type TypographyVariant =
    | 'displayLarge'
    | 'displayMedium'
    | 'displaySmall'
    | 'headlineLarge'
    | 'headlineMedium'
    | 'headlineSmall'
    | 'titleLarge'
    | 'titleMedium'
    | 'titleSmall'
    | 'bodyLarge'
    | 'bodyMedium'
    | 'bodySmall'
    | 'labelLarge'
    | 'labelMedium'
    | 'labelSmall';

interface ThemedTextProps {
    variant?: TypographyVariant;
    color?: string;
    weight?: keyof typeof typography.fontWeight;
    align?: 'left' | 'center' | 'right';
    children: React.ReactNode;
    style?: TextStyle;
    numberOfLines?: number;
}

const variantStyles: Record<TypographyVariant, TextStyle> = {
    displayLarge: {
        fontSize: typography.fontSize.displayLarge,
        lineHeight: typography.lineHeight.displayLarge,
        fontWeight: typography.fontWeight.bold,
    },
    displayMedium: {
        fontSize: typography.fontSize.displayMedium,
        lineHeight: typography.lineHeight.displayMedium,
        fontWeight: typography.fontWeight.bold,
    },
    displaySmall: {
        fontSize: typography.fontSize.displaySmall,
        lineHeight: typography.lineHeight.displaySmall,
        fontWeight: typography.fontWeight.bold,
    },
    headlineLarge: {
        fontSize: typography.fontSize.headlineLarge,
        lineHeight: typography.lineHeight.headlineLarge,
        fontWeight: typography.fontWeight.semibold,
    },
    headlineMedium: {
        fontSize: typography.fontSize.headlineMedium,
        lineHeight: typography.lineHeight.headlineMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    headlineSmall: {
        fontSize: typography.fontSize.headlineSmall,
        lineHeight: typography.lineHeight.headlineSmall,
        fontWeight: typography.fontWeight.semibold,
    },
    titleLarge: {
        fontSize: typography.fontSize.titleLarge,
        lineHeight: typography.lineHeight.titleLarge,
        fontWeight: typography.fontWeight.medium,
    },
    titleMedium: {
        fontSize: typography.fontSize.titleMedium,
        lineHeight: typography.lineHeight.titleMedium,
        fontWeight: typography.fontWeight.medium,
    },
    titleSmall: {
        fontSize: typography.fontSize.titleSmall,
        lineHeight: typography.lineHeight.titleSmall,
        fontWeight: typography.fontWeight.medium,
    },
    bodyLarge: {
        fontSize: typography.fontSize.bodyLarge,
        lineHeight: typography.lineHeight.bodyLarge,
        fontWeight: typography.fontWeight.regular,
    },
    bodyMedium: {
        fontSize: typography.fontSize.bodyMedium,
        lineHeight: typography.lineHeight.bodyMedium,
        fontWeight: typography.fontWeight.regular,
    },
    bodySmall: {
        fontSize: typography.fontSize.bodySmall,
        lineHeight: typography.lineHeight.bodySmall,
        fontWeight: typography.fontWeight.regular,
    },
    labelLarge: {
        fontSize: typography.fontSize.labelLarge,
        lineHeight: typography.lineHeight.labelLarge,
        fontWeight: typography.fontWeight.medium,
    },
    labelMedium: {
        fontSize: typography.fontSize.labelMedium,
        lineHeight: typography.lineHeight.labelMedium,
        fontWeight: typography.fontWeight.medium,
    },
    labelSmall: {
        fontSize: typography.fontSize.labelSmall,
        lineHeight: typography.lineHeight.labelSmall,
        fontWeight: typography.fontWeight.medium,
    },
};

export default function ThemedText({
    variant = 'bodyMedium', color = colors.onSurface, weight, 
    align='left', children, style, numberOfLines,
}: ThemedTextProps) {
    const variantStyle = variantStyles[variant];

    return (
        <Text
            style={[
                variantStyle,
                { color, textAlign: align },
                weight && { fontWeight: typography.fontWeight[weight] },
                style,
            ]}
            numberOfLines={numberOfLines}
        >
            {children}
        </Text>
    );
};
