import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Image,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import img from "../../assets/image/img-bg.png";
import foto from "../../assets/image/Rectangle.png";
import { ImageBackground } from "react-native";
import { SignupSchema } from "../../options/validForm";
import { styles } from "./style.js";
import { authSignUp } from "../../redux/auth/authOptions";

function RegistrationScreen() {
  const [isShowKey, setIsShowKey] = useState(false);
  const navigation = useNavigation();
  const [isFocus, setIsFocus] = useState({
    email: false,
    password: false,
    login: false,
  });

  const dispatch = useDispatch();

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

  const handlerSubmit = (values) => {
    dispatch(authSignUp(values));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ImageBackground style={styles.imgBg} source={img}>
          <Formik
            initialValues={{ email: "", login: "", password: "" }}
            validationSchema={SignupSchema}
          >
            {({ values, errors, handleChange, resetForm }) => (
              <View style={styles.box}>
                <View style={styles.avatar}>
                  <Image source={foto} style={styles.avatarImage} />
                  {!foto ? (
                    <TouchableOpacity
                      style={styles.btnAddAvatar}
                      activeOpacity={0.9}
                    >
                      <Ionicons name="add" size={20} color="#FF6C00" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.btnRemoveAvatar}
                      activeOpacity={0.9}
                    >
                      <Ionicons name="close" size={20} color="#E8E8E8" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.headerRegistr}>
                  <Text style={styles.title}>Реєстрація</Text>
                </View>
                <View
                  style={{
                    ...styles.form,
                    marginBottom: isShowKey ? -20 : 111,
                  }}
                >
                  <View>
                    <TextInput
                      placeholderTextColor={"#BDBDBD"}
                      placeholder={"Логін"}
                      style={{
                        ...styles.input,
                        borderColor: isFocus.login ? "#FF6C00" : "#F6F6F6",
                        backgroundColor: isFocus.login ? "#FFFFFF" : "#F6F6F6",
                      }}
                      value={values.login}
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
                      onChangeText={handleChange("login")}
                    />
                    {errors.login && (
                      <View style={styles.validContainer}>
                        <Text style={styles.valid}>{errors.login}</Text>
                      </View>
                    )}
                  </View>

                  <View style={{ marginTop: 16 }}>
                    <TextInput
                      placeholderTextColor={"#BDBDBD"}
                      placeholder={"Адреса електронної пошти"}
                      inputMode={"email"}
                      keyboardType={"email-address"}
                      style={{
                        ...styles.input,
                        borderColor: isFocus.email ? "#FF6C00" : "#F6F6F6",
                        backgroundColor: isFocus.email ? "#FFFFFF" : "#F6F6F6",
                      }}
                      value={values.email}
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
                      onChangeText={handleChange("email")}
                    />
                    {errors.email && (
                      <View style={styles.validContainer}>
                        <Text style={styles.valid}>{errors.email}</Text>
                      </View>
                    )}
                  </View>
                  <View style={{ marginTop: 16 }}>
                    <TextInput
                      placeholderTextColor={"#BDBDBD"}
                      placeholder={"••••••••••••"}
                      style={{
                        ...styles.input,
                        borderColor: isFocus.password ? "#FF6C00" : "#F6F6F6",
                        backgroundColor: isFocus.password
                          ? "#FFFFFF"
                          : "#F6F6F6",
                      }}
                      value={values.password}
                      secureTextEntry={true}
                      selectionColor={"#FF6C00"}
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
                      onChangeText={handleChange("password")}
                    />
                    {errors.password && (
                      <View style={styles.validContainer}>
                        <Text style={styles.valid}>{errors.password}</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      handlerSubmit(values);
                      resetForm({
                        values: {
                          login: "",
                          email: "",
                          password: "",
                        },
                      });
                    }}
                  >
                    <Text style={styles.buttonText}>Зареєстуватися</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bottomContainer}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.bottomText}>
                      Вже є акаунт?<Text>Увійти</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ImageBackground>
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default RegistrationScreen;