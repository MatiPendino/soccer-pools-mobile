import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { colors, borderRadius, spacing, typography } from '../../theme';

interface ThemedInputProps {
    inputMode?: 'text' | 'email' | 'numeric';
    placeholder?: string;
    isSecureTextEntry?: boolean;
    value: string;
    setValue: (value: string) => void;
    isActive?: boolean;
    isCapitalized?: boolean;
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export default function ThemedInput({
    inputMode = 'text', placeholder, isSecureTextEntry = false, value, setValue, isActive = true,
    isCapitalized = false, label, error, icon,
}: ThemedInputProps) {
    const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const { isLG } = useBreakpoint();

    const getBorderColor = () => {
        if (error) return colors.error;
        if (isFocused) return colors.accent;
        return colors.surfaceBorder;
    };

    return (
        <View style={[styles.container, { width: isLG ? '100%' : '100%' }]}>
            {label && (
                <Text style={[
                    styles.label,
                    isFocused && styles.labelFocused,
                    error && styles.labelError
                ]}>
                    {label}
                </Text>
            )}
            <View style={[
                styles.inputContainer,
                { borderColor: getBorderColor() },
                isFocused && styles.inputFocused,
            ]}>
                {icon && <View style={styles.iconLeft}>{icon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        !isActive && styles.inputDisabled,
                        icon && styles.inputWithIcon,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={value}
                    onChangeText={setValue}
                    secureTextEntry={isPasswordHidden && isSecureTextEntry}
                    autoCapitalize={isCapitalized ? 'words' : 'none'}
                    editable={isActive}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    inputMode={inputMode}
                    selectionColor={colors.accent}
                />
                {isSecureTextEntry && (
                    <Pressable
                        onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                        style={styles.eyeButton}
                    >
                        <Ionicons
                            name={isPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color={colors.textMuted}
                        />
                    </Pressable>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    label: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.labelMedium,
        fontWeight: typography.fontWeight.medium,
        marginBottom: spacing.sm,
    },
    labelFocused: {
        color: colors.accent,
    },
    labelError: {
        color: colors.error,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundInput,
        borderRadius: borderRadius.md,
        borderWidth: 1.5,
        borderColor: colors.surfaceBorder,
    },
    inputFocused: {
        backgroundColor: colors.backgroundCard,
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: typography.fontSize.bodyMedium,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
    },
    inputWithIcon: {
        paddingLeft: 0,
    },
    inputDisabled: {
        color: colors.textDisabled,
    },
    iconLeft: {
        paddingLeft: spacing.md,
    },
    eyeButton: {
        padding: spacing.md,
    },
    errorText: {
        color: colors.error,
        fontSize: typography.fontSize.labelSmall,
        marginTop: spacing.xs,
    },
});
