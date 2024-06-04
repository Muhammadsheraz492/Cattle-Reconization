// SignupScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

const SignupScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                keyboardType="default"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={() => alert('Sign Up clicked!')}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.loginLink} onPress={() => alert('Go to Login!')}>
                    Login
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginVertical: 10,
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        fontSize: 16,
        color: '#333',
    },
    loginLink: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
});

export default SignupScreen;
