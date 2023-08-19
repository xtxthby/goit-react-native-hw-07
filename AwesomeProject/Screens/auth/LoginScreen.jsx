import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ImageBackground,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import img from "../../assets/image/img-bg.png";
import { SignupSchema } from "../../options/validForm";
import { styles } from "./style.js";
import { loginDB } from "../../redux/auth/authOptions";

function LoginScreen() {
  const [isShowKey, setIsShowKey] = useState(false);
  const navigation = useNavigation();
  const [isFocus, setIsFocus] = useState({
    email: false,
    password: false,
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
    dispatch(loginDB(values));
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ImageBackground style={styles.imgBg} source={img}>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={SignupSchema}
          >
            {({ values, errors, handleChange, resetForm }) => (
              <View style={styles.box}>
                <View style={styles.headerLogin}>
                  <Text style={styles.title}>Увійти</Text>
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
                          email: "",
                          password: "",
                        },
                      });
                    }}
                  >
                    <Text style={styles.buttonText}>Увійти</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bottomContainer}
                    onPress={() => navigation.navigate("Registration")}
                  >
                    <Text style={styles.bottomText}>
                      Немає акаунту?<Text>Зареєструватися</Text>
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

export default LoginScreen;
