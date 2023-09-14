import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";

import { CommentsScreen } from "../nestedScreens/CommentsScreen";
import { MapScreen } from "../nestedScreens/MapScreen";
import { DefaultPostsScreen } from "../nestedScreens/DefaultPostsScreen";
import { authSignOutUser } from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";

const NestedScreen = createStackNavigator();

export const PostsScreen = () => {
  const dispatch = useDispatch();

  const handlerSignOut = () => {
    dispatch(authSignOutUser());
  };
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="DefaultPostsScreen"
        component={DefaultPostsScreen}
        options={{
          headerTitle: "Публікації",
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
          headerRight: () => (
            <TouchableOpacity
              onPress={handlerSignOut}
              title="logOut"
              color="#fff">
              <Feather
                name="log-out"
                size={24}
                color="#BDBDBD"
                marginRight={20}
                marginTop={10}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          headerTitle: "Коментарі",
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
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerTitle: "Карта",
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
      />
    </NestedScreen.Navigator>
  );
};
