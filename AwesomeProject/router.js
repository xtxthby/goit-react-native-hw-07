import { createStackNavigator } from "@react-navigation/stack";
import RegistrationScreen from "./Screens/auth/RegistrationScreen";
import LoginScreen from "./Screens/auth/LoginScreen";
import Home from "./Screens/mainScreens/Home";

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Registration" component={RegistrationScreen} />
      </AuthStack.Navigator>
    );
  }
  return (
    <HomeStack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      />
    </HomeStack.Navigator>
  );
};