import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PostsScreen } from "./PostsScreen";
import { CreatePostsScreen } from "./CreatePostsScreen";
import { ProfileScreen } from "./ProfileScreen";
import { useNavigation } from "@react-navigation/native";

const MainTab = createBottomTabNavigator();

export const HomeScreen = () => {
  const navigation = useNavigation();
  const goToPost = () => {
    navigation.navigate("Posts");
  };
  return (
    <MainTab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 58,
          paddingRight: 30,
          paddingLeft: 30,
        },
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: "rgba(33, 33, 33, 0.8)",
        tabBarActiveTintColor: "#FFFFFF",
      })}>
      <MainTab.Screen
        options={{
          tabBarIcon: () => <Feather name="grid" size={24} color="black" />,
          headerShown: false,
        }}
        name="Posts"
        component={PostsScreen}
      />
      <MainTab.Screen
        options={{
          tabBarIcon: () => (
            <View style={{ ...styles.iconAdd, backgroundColor: "#FF6C00" }}>
              <Feather name="plus" size={24} color="white" />
            </View>
          ),
          tabBarStyle: { display: "none" },
          headerTitle: "Створити публікацію",
          headerTitleAlign: "center",
          headerStyle: {
            height: 88,
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            marginTop: 10,
            fontFamily: "Roboto-Regular",
            fontSize: 20,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={goToPost} color="#fff">
              <Feather
                name="arrow-left"
                size={24}
                color="#212121"
                marginLeft={20}
                marginTop={10}
              />
            </TouchableOpacity>
          ),
        }}
        name="CreatePosts"
        component={CreatePostsScreen}
      />
      <MainTab.Screen
        options={{
          tabBarIcon: () => <Feather name="user" size={24} color="black" />,
          headerTitle: "Профіль",
          headerTitleAlign: "center",
          headerStyle: {
            height: 88,
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            marginTop: 10,
            fontFamily: "Roboto-Regular",
            fontSize: 20,
          },
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconAdd: {
    width: 70,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  trashBtn: {
    position: "relative",

    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 40,
    backgroundColor: "#F6F6F6",
    borderRadius: 50,
  },
});