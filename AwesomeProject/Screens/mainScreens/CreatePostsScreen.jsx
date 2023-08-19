import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Image,
  Button,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Entypo, EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { useSelector } from "react-redux";

function CreatePostsScreen() {
  const [isShowKey, setIsShowKey] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState("");
  const [snap, setSnap] = useState(null);
  const [text, setText] = useState("");
  const [locationText, setLocationText] = useState("");
  const navigation = useNavigation();
  const login = useSelector((state) => state.auth.login);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsShowKey(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsShowKey(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const takePhoto = async () => {
    const photo = await snap.takePictureAsync();
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
    }
    const location = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setLocation(coords);
    setPhoto(photo.uri);
  };

  const sendPhoto = () => {
    if (photo !== "") {
      uploadPostToServer();
      navigation.navigate("Default");
      setPhoto("");
      setText("");
      setLocationText("");
    }
  };

  const deletePhoto = () => {
    setPhoto("");
  };
  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        photo,
        title: text,
        location,
        locationText,
        userId,
        login,
        likes: 0,
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const uploadPhotoToServer = async () => {
    try {
      const response = await fetch(photo);
      const file = await response.blob();
      const uniquePostId = Date.now().toString();
      const storageRef = ref(storage, `postImage/${uniquePostId}`);
      await uploadBytes(storageRef, file);

      const getStorageRef = await getDownloadURL(ref(storageRef));

      return getStorageRef;
    } catch (error) {
      throw error;
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Camera style={styles.camera} type={type} ref={setSnap}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <MaterialIcons name="flip-camera-ios" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.snapContainer} onPress={takePhoto}>
              <Entypo name="camera" size={24} color="#BDBDBD" />
            </TouchableOpacity>
            {photo && (
              <View style={styles.photo}>
                <Image source={{ uri: photo }} style={{ height: 240 }} />
              </View>
            )}
          </Camera>
          <View>
            <View>
              <TouchableOpacity style={{ marginLeft: 16, marginTop: 5 }}>
                <Text
                  style={{
                    color: "#BDBDBD",
                    fontSize: 16,
                    fontFamily: "RobotoMono-Regular",
                  }}
                >
                  Завантажте фото
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 10 }}>
              <TextInput
                placeholderTextColor={"#BDBDBD"}
                placeholder="Назва..."
                style={styles.input}
                onChangeText={setText}
                value={text}
              />
            </View>

            <View style={{ marginTop: 10 }}>
              <TextInput
                placeholder="Місцевість..."
                placeholderTextColor={"#BDBDBD"}
                style={styles.input}
                onChangeText={setLocationText}
                value={locationText}
              />
              <EvilIcons
                name="location"
                size={24}
                color="#BDBDBD"
                style={styles.location}
              />
            </View>
            <TouchableOpacity style={styles.sendBtn} onPress={sendPhoto}>
              <Text style={styles.sendLabel}>Опубліковати</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteContainer}
              onPress={deletePhoto}
            >
              <MaterialIcons name="delete" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
export default CreatePostsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  camera: {
    height: 240,
    marginHorizontal: 16,
    marginTop: 32,
  },
  photo: {
    height: "100%",
  },
  snapContainer: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  sendBtn: {
    marginTop: 32,
    marginHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: "center",
    borderColor: "#FF6C00",
    backgroundColor: "#FF6C00",
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 16,
    paddingBottom: 16,
  },
  sendLabel: {
    fontFamily: "RobotoMono-Regular",
    color: "#FfFFFf",
    fontSize: 16,
  },
  input: {
    justifyContent: "center",
    marginHorizontal: 30,
    height: 50,
    borderBottomColor: "#E8E8E8",
    borderBottomWidth: 1,
    color: "#212121",
    fontSize: 16,
    fontFamily: "RobotoMono-Regular",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  deleteContainer: {
    marginTop: 100,
    width: 70,
    height: 40,
    borderRadius: 19,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
  },
  deleteIcon: {
    alignSelf: "center",
  },
  text: {
    color: "#fff",
  },
  button: {
    position: "absolute",
    top: 10,
    right: 20,
    width: 20,
    height: 20,
  },
  location: {
    position: "absolute",
    top: 12,
    marginLeft: 25,
  },
});
