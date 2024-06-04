import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function Livedetection() {
  const cameraRef = useRef(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(undefined);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(undefined);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>;
  }

  const recordVideo = () => {
    setIsRecording(true);
    const options = {
      quality: "1080p",
      maxDuration: 60,
      mute: false,
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  const shareVideo = () => {
    shareAsync(video.uri).then(() => setVideo(null));
  };

  const saveVideo = () => {
    MediaLibrary.saveToLibraryAsync(video.uri).then(() => setVideo(null));
  };

  const discardVideo = () => {
    setVideo(null);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (video) {
    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode="contain"
          isLooping
        />
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.button} onPress={shareVideo}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
          {hasMediaLibraryPermission && (
            <TouchableOpacity style={styles.button} onPress={saveVideo}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={discardVideo}>
            <Text style={styles.buttonText}>Discard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.topContainer}>
        {isRecording && <Text style={styles.timer}>{formatTime(timer)}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.recordButton} onPress={isRecording ? stopRecording : recordVideo}>
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
  video: {
    width: '100%',
    height: '60%',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  button: {
    width: '30%',
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  recordButton: {
    width: '50%',
    height: 50,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
