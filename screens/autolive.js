import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import axios from 'axios';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AutoLivedetection() {
  const cameraRef = useRef(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(undefined);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const getEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('@user_email');
        setEmail(storedEmail);
      } catch (error) {
        console.error('Failed to retrieve email', error);
      }
    };

    (async () => {
      getEmail();
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
    })();
  }, []);

  useEffect(() => {
    let timerInterval;
    if (isRecording) {
      timerInterval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval);
      setTimer(0);
    }
    return () => clearInterval(timerInterval);
  }, [isRecording]);

  useEffect(() => {
    let recordInterval;
    if (isRecording) {
      recordInterval = setInterval(async () => {
        await recordAndUploadVideo();
      }, 10000); // 10 seconds interval
    } else {
      clearInterval(recordInterval);
    }
    return () => clearInterval(recordInterval);
  }, [isRecording]);

  const startRecordingCycle = () => {
    setIsRecording(true);
  };

  const stopRecordingCycle = () => {
    setIsRecording(false);
  };

  const recordAndUploadVideo = async () => {
    try {
      const recordedVideo = await cameraRef.current.recordAsync({
        quality: "1080p",
        maxDuration: 10, // Record for 10 seconds
        mute: false,
      });
      setTimer(0); // Reset the timer after each recording
      await uploadVideo(recordedVideo);
    } catch (error) {
      console.error("Recording or uploading failed", error);
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
    } catch (error) {
      console.error("Video upload failed", error);
      Alert.alert('Video upload failed!');
    } finally {
      setUploading(false);
    }
  };

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>;
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.topContainer}>
        {isRecording && <Text style={styles.timer}>{`${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.recordButton} onPress={isRecording ? stopRecordingCycle : startRecordingCycle}>
          <Text style={styles.buttonText}>{isRecording ? "Stop Recording" : "Start Recording"}</Text>
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
