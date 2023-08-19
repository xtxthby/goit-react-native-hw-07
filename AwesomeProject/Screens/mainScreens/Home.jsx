import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import { Feather } from "@expo/vector-icons";

const MainTab = createBottomTabNavigator();

const Home = ({ navigation }) => {
  const [isFocusedGrid, setIsFocusedGrid] = useState(false);
  const [isFocusedUser, setIsFocusedUser] = useState(false);
  return (
    <MainTab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: false,
        tabBarStyle: { height: 58 },
        tabBarInactiveTintColor: "rgba(33, 33, 33, 0.8)",
        tabBarActiveTintColor: "#FFF",
      })}
    >
      <MainTab.Screen
        name="Posts"
        component={PostsScreen}
        options={() => ({
          headerStyle: {
            height: 5,
          },

          tabBarIcon: () => (
            <TouchableOpacity
              onPress={() => {
                setIsFocusedUser(false);
                setIsFocusedGrid(true);
                navigation.navigate("Posts");
              }}
            >
              <Feather
                name="grid"
                size={24}
                color={isFocusedGrid ? "#FF6C00" : "#212121"}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <MainTab.Screen
        name="Create"
        component={CreatePostsScreen}
        options={() => ({
          tabBarStyle: { display: "none" },
          tabBarIcon: () => (
            <View style={{ ...styles.iconNav, backgroundColor: "#FF6C00" }}>
              <Feather name="plus" size={24} color={"#fff"} />
            </View>
          ),
          headerTitle: "Створити публікацію",
          headerTitleAlign: "center",
          headerStyle: {
            height: 58,
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            marginTop: 10,
            fontFamily: "RobotoMono-Regular",
            fontSize: 20,
          },
          headerTintColor: "#212121",
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 16, width: 20, height: 20 }}
              onPress={() => {
                navigation.navigate("Posts"),
                  setIsFocusedGrid(true),
                  setIsFocusedUser(false);
              }}
            >
              <Feather
                name="arrow-left"
                size={24}
                color="rgba(33, 33, 33, 0.8)"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={() => ({
          headerTitle: "Профіль",
          headerTitleAlign: "center",
          headerStyle: {
            height: 68,
            backgroundColor: "#FFF",
          },
          headerTitleStyle: {
            marginTop: 5,
            fontFamily: "RobotoMono-Regular",
            fontSize: 20,
          },
          headerTintColor: "#212121",
          tabBarIcon: () => (
            <TouchableOpacity
              onPress={() => {
                setIsFocusedUser(true);
                setIsFocusedGrid(false);
                navigation.navigate("Profile");
              }}
            >
              <Feather
                name="user"
                size={24}
                color={isFocusedUser ? "#FF6C00" : "#212121"}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </MainTab.Navigator>
  );
};
export default Home;

const styles = StyleSheet.create({
  iconNav: {
    width: 70,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
