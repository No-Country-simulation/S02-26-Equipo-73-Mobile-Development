import { BorderRadius, Colors, Spacing } from '@/src/constants';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { ThemedText } from './ThemedText';


export interface ThemedButtonProps extends TouchableOpacityProps {
    isLoading?: boolean;
    label: string;
}



export function ThemedButton({onPress, label, isLoading, style, ...touchableProps }: ThemedButtonProps){
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.light.accent }, isLoading && styles.buttonDisabled, style]}
            onPress={onPress}
            disabled={isLoading}
            {...touchableProps}
        >
            {isLoading ? (
                <ActivityIndicator color={Colors.light.primary} />
            ) : (
                <ThemedText variant="buttonRegular" lightColor={Colors.light.primary} style={styles.buttonText}>
                    {label}
                </ThemedText>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        marginTop: Spacing.md,
        marginBottom: Spacing.lg,
        shadowColor: Colors.light.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        fontWeight: '700'
    },
    buttonDisabled: {
        opacity: 0.6,
    }
})

