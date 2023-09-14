import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";

import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import { db, storage } from "../../firebase/config";

export const CreatePostsScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isShownKey, setIsShownKey] = useState(false);
  const [picName, setPicName] = useState("");
  const [postLocation, setPostLocation] = useState(null);
  const [postAddress, setPostAddress] = useState("");
  const [isFocus, setIsFocus] = useState({
    picName: false,
    postLocation: false,
  });
  console.log(postLocation);

  const { login, userId } = useSelector((state) => state.auth);
  const resetForm = () => {
    setPhoto("");
    setPicName("");
    setPostLocation(null);
    setPostAddress("");
  };

  const handelSubmit = () => {
    if (!photo || !picName)
      return console.warn(" Введіть будь ласка дані та завантажте фото");
    uploadPostToServer();
    navigation.navigate("DefaultPostsScreen");

    keyBoardHide();
    resetForm();
  };

  const keyBoardHide = () => {
    setIsShownKey(true);
    Keyboard.dismiss();
    resetForm();
  };
  const handelTrash = () => {
    resetForm();
    navigation.navigate("Posts");
  };
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsShownKey(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsShownKey(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setPostLocation(location);
    })();
  }, []);

  const takePhoto = async () => {
    const photo = await camera.takePictureAsync();
    const location = await Location.getCurrentPositionAsync();
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    const [address] = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setPostAddress(address.city);
    setPostLocation(coords);

    console.log(postAddress);
    setPhoto(photo.uri);
    console.log(photo.uri);
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        photo,
        postAddress,
        postLocation,
        picName,
        userId,
        login,
        likes: 0,
        commentList: [],
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
      console.log(file);
      const uniqePostId = Date.now().toString();
      const storageRef = await ref(storage, `postImage/${uniqePostId}`);

      await uploadBytes(storageRef, file);
      const getStorageRef = await getDownloadURL(ref(storageRef));

      return getStorageRef;
    } catch (error) {
      throw error;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={keyBoardHide}>
      <View style={styles.container}>
        <Camera style={styles.camera} ref={setCamera}>
          {photo && (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: photo }}
                style={{ height: 240, width: 343 }}
              />
            </View>
          )}
          <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
            <MaterialCommunityIcons
              name="camera"
              size={24}
              color="#BDBDBD"
              position="absolute"
              top={18}
              left={18}
            />
          </TouchableOpacity>
        </Camera>
        {photo ? (
          <Text style={styles.cameraNotice}>Редагувати фото</Text>
        ) : (
          <Text style={styles.cameraNotice}>Завантажте фото</Text>
        )}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View
            style={{
              ...styles.createForm,
              marginBottom: isShownKey ? 20 : 130,
            }}>
            <View>
              <TextInput
                placeholder="Назва..."
                value={picName}
                style={{
                  ...styles.input,
                  borderBottomColor: isFocus.picName ? "#FF6C00" : "#F6F6F6",
                }}
                onFocus={() => {
                  setIsFocus({
                    ...isFocus,
                    picName: true,
                  });
                }}
                onBlur={() => {
                  setIsFocus({
                    ...isFocus,
                    picName: false,
                  });
                }}
                onChangeText={setPicName}
              />
            </View>

            <View>
              <Feather
                name="map-pin"
                size={24}
                color="#BDBDBD"
                position="absolute"
                top={30}
              />
              <TextInput
                placeholder="Місцевість..."
                value={postAddress}
                style={{
                  ...styles.inputLocation,
                  borderBottomColor: isFocus.postLocation
                    ? "#FF6C00"
                    : "#F6F6F6",
                }}
                onFocus={() => {
                  setIsFocus({
                    ...isFocus,
                    postLocation: true,
                  });
                }}
                onBlur={() => {
                  setIsFocus({
                    ...isFocus,
                    postLocation: false,
                  });
                }}
                onChangeText={setPostAddress}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.createBtn}
              onPress={handelSubmit}>
              <Text style={styles.buttonTitle}>
                <Text style={styles.createBtnText}>Опублікувати</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <TouchableOpacity style={styles.trashBtn} onPress={handelTrash}>
          <Feather
            name="trash-2"
            size={24}
            color="#BDBDBD"
            position="absolute"
            top={8}
            left={22}
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 26,
    paddingRight: 26,
  },
  camera: {
    height: 240,
    width: 343,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#BDBDBD",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBtn: {
    position: "relative",
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  cameraNotice: {
    marginTop: 10,
    marginLeft: 10,
    color: "#BDBDBD",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
  photoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  createForm: {},

  input: {
    height: 50,
    color: "#000000",
    borderBottomColor: "#808080",
    borderBottomWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  inputLocation: {
    position: "relative",
    height: 50,
    color: "#000000",
    borderBottomColor: "#808080",
    borderBottomWidth: 1,
    marginTop: 20,
    paddingLeft: 28,
    padding: 10,
  },
  createBtn: {
    backgroundColor: "#FF6C00",
    height: 50,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  createBtnText: {
    color: "#fff",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  trashBtn: {
    position: "relative",

    marginLeft: 136,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 40,
    backgroundColor: "#F6F6F6",
    borderRadius: 50,
  },
});