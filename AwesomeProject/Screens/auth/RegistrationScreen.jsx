import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import { authSignUpUser } from "../../redux/auth/authOperations";
import foto from "../../assets/images/AvatarPhoto.png";
import img from "../../assets/images/PhotoBG.png";
import { styles } from "../style";

export const RegistrationScreen = ({ navigation }) => {
  const [isShownKey, setIsShownKey] = useState(false);
  const [isFocus, setIsFocus] = useState({
    email: false,
    password: false,
    login: false,
  });
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log(login, email, password);
  const data = { ...login, ...email, ...password };
  console.log(data);
  const dispatch = useDispatch();

  const resetForm = () => {
    setLogin("");
    setPassword("");
    setEmail("");
  };
  const validateEmail = (email) => {
    // console.log(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // console.log(emailRegex);
    return emailRegex.test(email.email);
  };

  const handelSubmit = () => {
    if (!login || !email || !password)
      return console.warn(" Введіть будь ласка дані");
    if (!validateEmail(email))
      return console.warn(`Некоректна адреса електронної пошти!`);
    dispatch(authSignUpUser(data));

    keyBoardHide();
    resetForm();
  };
  const keyBoardHide = () => {
    setIsShownKey(true);
    Keyboard.dismiss();
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

  return (
    <TouchableWithoutFeedback onPress={keyBoardHide}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}>
        <ImageBackground style={styles.imgBg} source={img}>
          <View
            style={{
              ...styles.form,
              paddingBottom: isShownKey ? 20 : 100,
            }}>
            <View style={styles.avatarContainer}>
              <Image source={foto} style={styles.avatarImage} />
              {!foto ? (
                <TouchableOpacity
                  style={styles.btnAddAvatar}
                  activeOpacity={0.9}>
                  <Ionicons name="add" size={20} color="#FF6C00" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.btnRemoveAvatar}
                  activeOpacity={0.9}>
                  <Ionicons name="close" size={20} color="#E8E8E8" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.title}>
              <Text style={styles.textTitle}>Реєстрація</Text>
            </View>

            <View>
              <TextInput
                placeholder="Логін"
                style={{
                  ...styles.input,
                  borderColor: isFocus.login ? "#FF6C00" : "#F6F6F6",
                  backgroundColor: isFocus.login ? "#FFFFFF" : "#F6F6F6",
                }}
                value={login}
                onFocus={() => {
                  setIsFocus({
                    ...isFocus,
                    login: true,
                  });
                }}
                onBlur={() => {
                  setIsFocus({
                    ...isFocus,
                    login: false,
                  });
                }}
                onChangeText={(login) => {
                  setLogin((prevState) => ({ ...prevState, login }));
                }}
              />
            </View>

            <View>
              <TextInput
                placeholder="Адреса електронної пошти"
                style={{
                  ...styles.input,
                  borderColor: isFocus.email ? "#FF6C00" : "#F6F6F6",
                  backgroundColor: isFocus.email ? "#FFFFFF" : "#F6F6F6",
                }}
                inputMode="email"
                keyboardType="email-address"
                autoComplete="email"
                value={email}
                onFocus={() => {
                  setIsFocus({
                    ...isFocus,
                    email: true,
                  });
                }}
                onBlur={() => {
                  setIsFocus({
                    ...isFocus,
                    email: false,
                  });
                }}
                onChangeText={(email) => {
                  setEmail((prevState) => ({ ...prevState, email }));
                }}
              />
            </View>

            <View>
              <TextInput
                placeholder="Пароль"
                style={{
                  ...styles.input,
                  borderColor: isFocus.password ? "#FF6C00" : "#F6F6F6",
                  backgroundColor: isFocus.password ? "#FFFFFF" : "#F6F6F6",
                }}
                value={password}
                secureTextEntry={true}
                onFocus={() => {
                  setIsFocus({
                    ...isFocus,
                    password: true,
                  });
                }}
                onBlur={() => {
                  setIsFocus({
                    ...isFocus,
                    password: false,
                  });
                }}
                onChangeText={(password) => {
                  setPassword((prevState) => ({
                    ...prevState,
                    password,
                  }));
                }}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={handelSubmit}>
              <Text style={styles.buttonTitle}>Зареєструватися</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notice}
              onPress={() => navigation.navigate("Login")}>
              <Text style={styles.textNotice}>
                Вже є акаунт?<Text>Увійти</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};