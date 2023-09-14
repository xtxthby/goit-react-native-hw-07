import React, { useEffect, useState } from "react";
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
} from "react-native";
import { useDispatch } from "react-redux";

import { authSignInUser } from "../../redux/auth/authOperations";
import img from "../../assets/images/PhotoBG.png";
import { styles } from "../style";

export const LoginScreen = ({ navigation }) => {
  const [isShownKey, setIsShownKey] = useState(false);
  const [isFocus, setIsFocus] = useState({
    email: false,
    password: false,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log(email);
  console.log(password);
  const data = { ...email, ...password };
  console.log(data);

  const dispatch = useDispatch();

  const resetForm = () => {
    setPassword("");
    setEmail("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.email);
  };

  const handelSubmit = () => {
    if (!email || !password) return console.warn(" Введіть будь ласка дані");
    if (!validateEmail(email))
      return console.warn("Некорректно введена електронна пошта");
    dispatch(authSignInUser(data));

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
            <View style={styles.title}>
              <Text style={styles.textTitle}>Увійти</Text>
            </View>

            <View>
              <TextInput
                placeholder="Адреса електронної пошти"
                style={{
                  ...styles.input,
                  borderColor: isFocus.email ? "#FF6C00" : "#F6F6F6",
                  backgroundColor: isFocus.email ? "#FFFFFF" : "#F6F6F6",
                }}
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
              <Text style={styles.buttonTitle}>Увійти</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notice}
              onPress={() => navigation.navigate("Register")}>
              <Text>
                Немає акаунту?
                <Text style={styles.linkButton}>Зареєструватися</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};