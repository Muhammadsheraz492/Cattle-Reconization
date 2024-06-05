import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [email,setemail]=useState()
    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('@user_email');
            // return email != null ? email : null;
            console.log(email);
            setemail(email)
        } catch (error) {
            console.error('Failed to retrieve email', error);
            // return null;
        }
    };

    const pickImage = async () => {
        // Ask for permission to access the gallery
        setImage(null);
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access gallery is required!");
            return;
        }

        // Open image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.uri);
        }
    };
    useEffect(()=>{
        getEmail()

    },[])

    const uploadImage = async () => {
        if (!image) return;

        setUploading(true);

        // Create a new FormData object
        let data = new FormData();
        data.append('images', {
            uri: image,
            type: 'image/jpeg',
            name: 'photo.jpg',
        });
        data.append('email', email);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://64.227.131.152:8001/api/upload/',
            headers: { 
                'Content-Type': 'multipart/form-data',
            },
            data: data,
        };

        try {
            const response = await axios.request(config);
            console.log(JSON.stringify(response.data));
            Alert.alert("Cattle Report",response.data.message);
        } catch (error) {
            console.log(error);
            Alert.alert('Image upload failed!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>
            {image && (
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: image }} />
                </View>
            )}
            <Text style={styles.subtitle}>Choose an option</Text>
            <TouchableOpacity 
                style={styles.button} 
                onPress={pickImage}
            >
                <Text style={styles.buttonText}>Pick</Text>
            </TouchableOpacity>
            {image && (
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={uploadImage}
                >
                    {uploading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Upload</Text>
                    )}
                </TouchableOpacity>
            )}
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('livedetection')} // Adjust the navigation target as necessary
            >
                <Text style={styles.buttonText}>Live Detection</Text>
            </TouchableOpacity>
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
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        color: '#666',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageContainer: {
        width: "90%",
        alignSelf: "center",
        height: 200,
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: 200,
    },
});

export default HomeScreen;
