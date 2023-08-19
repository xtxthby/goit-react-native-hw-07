import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import DefaultScreenPost from "../nestedScreens/DefaultScreenPost";
import CommentsScreen from "../nestedScreens/CommentsScreen";
import MapScreens from "../nestedScreens/MapScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { authSignOutUser } from "../../redux/auth/authOptions";

const NestedScreen = createStackNavigator();

const PostsScreens = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlerLogOut = () => {
    dispatch(authSignOutUser());
  };

  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="Default"
        component={DefaultScreenPost}
        options={() => ({
          headerTitle: "Публікації",
          headerTitleAlign: "center",
          headerStyle: {
            height: 58,
            backgroundColor: "#FFF",
          },
          headerTitleStyle: {
            marginTop: 20,
            fontFamily: "RobotoMono-Regular",
            fontSize: 20,
          },
          headerTintColor: "#212121",
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 20, width: 20, height: 20 }}
              onPress={handlerLogOut}
            >
              <Feather name="log-out" size={20} color="rgba(33, 33, 33, 0.8)" />
            </TouchableOpacity>
          ),
        })}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={() => ({
          headerTitle: "Коментарі",
          headerTitleAlign: "center",
          headerStyle: {
            height: 58,
            backgroundColor: "#FFF",
          },
          headerTitleStyle: {
            marginTop: 20,
            fontFamily: "RobotoMono-Regular",
            fontSize: 20,
          },
          headerTintColor: "#212121",
        })}
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreens}
        options={() => ({
          headerTitle: "Мапа",
          headerTitleAlign: "center",
          headerStyle: {
            height: 58,
            backgroundColor: "#FFF",
          },
          headerTitleStyle: {
            marginTop: 20,
            fontFamily: "RobotoMono-Regular",
            fontSize: 20,
          },
          headerTintColor: "#212121",
        })}
      />
    </NestedScreen.Navigator>
  );
};
export default PostsScreens;