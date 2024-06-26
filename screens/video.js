import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, AccessibilityInfo, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Livedetection() {
  const cameraRef = useRef(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(undefined);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(undefined);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState(null);
  const [timer, setTimer] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState(null);

  const getEmail = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('@user_email');
      setEmail(storedEmail);
    } catch (error) {
      console.error('Failed to retrieve email', error);
    }
  };

  useEffect(() => {
    (async () => {
      await getEmail();
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (hasCameraPermission && hasMicrophonePermission) {
      startRecording();
    }
  }, [hasCameraPermission, hasMicrophonePermission]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime === 59) {
            stopRecording();
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const options = {
        quality: "1080p",
        maxDuration: 7200,
        mute: false,
      };
      try {
        const recordedVideo = await cameraRef.current.recordAsync(options);
        setVideo(recordedVideo);
        setIsRecording(false);
        uploadVideo(recordedVideo);
      } catch (error) {
        console.log('Failed to start recording', error);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      setIsRecording(false);
      cameraRef.current.stopRecording();
    }
  };

  const uploadVideo = async (recordedVideo) => {
    if (!recordedVideo.uri) return;

    setUploading(true);

    let data = new FormData();
    data.append('video_file', {
      uri: recordedVideo.uri,
      type: 'video/mp4',
      name: 'video.mp4',
    });
    data.append('title', 'Sample');
    data.append('email', email);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://64.227.131.152:8001/api/video-upload/',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      Alert.alert('Live Detection', response.data.message);
      setUploading(false);
      startRecording();
    } catch (error) {
      console.log(error);
      Alert.alert('Video upload failed!');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>;
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.topContainer}>
        {isRecording && <Text style={styles.timer}>{formatTime(timer)}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.recordButton} onPress={isRecording ? stopRecording : startRecording}>
          <Text style={styles.buttonText}>{isRecording ? "Stop Recording" : "Record Video"}</Text>
        </TouchableOpacity>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  topContainer: {
    position: 'absolute',
    top: 30,
    width: '100%',
    alignItems: 'center',
  },
  timer: {
    fontSize: 24,
    color: '#FFF',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  recordButton: {
    width: '50%',
    height: 50,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
