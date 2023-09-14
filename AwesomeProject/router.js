import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "./Screens/auth/LoginScreen";
import { RegistrationScreen } from "./Screens/auth/RegistrationScreen";
import { HomeScreen } from "./Screens/main/Home";

const Stack = createStackNavigator();

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Register"
          component={RegistrationScreen}
        />
      </Stack.Navigator>
    );
  }
  return <HomeScreen />;
};