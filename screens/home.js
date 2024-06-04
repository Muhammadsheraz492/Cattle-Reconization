import React,{useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const HomeScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // Ask for permission to access the gallery
        setImage(null)
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

        if (!result.cancelled) {
            console.log(result.uri);
            setImage(result.uri);
            console.log(result.uri);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>
            {image&&(
                <View style={{width:"90%",alignSelf:"center",height:200,marginBottom:20}}>
                    <Image
                    style={{width:"100%",height:200}}
                    source={{uri:image}} />
                </View>
            )

            }
            <Text style={styles.subtitle}>Choose an option</Text>
            
            <TouchableOpacity 
                style={styles.button} 
                // onPress={() => navigation.navigate('PickScreen')} // Adjust the navigation target as necessary
                onPress={pickImage}
            >
                <Text style={styles.buttonText}>Pick</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('LiveDetectScreen')} // Adjust the navigation target as necessary
            >
                <Text style={styles.buttonText}>Live Detect</Text>
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
    }
});

export default HomeScreen;
