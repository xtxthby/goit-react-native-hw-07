import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";

import foto from "../../assets/images/AvatarPhoto.png";
import { db } from "../../firebase/config";

export const DefaultPostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const { login, email } = useSelector((state) => state.auth);
  useEffect(() => {
    getAllPosts();
  }, []);
  console.log(posts);

  const getAllPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    if (querySnapshot) {
      setPosts(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userWrapper}>
        <Image source={foto} style={styles.avatarImg} />
        <View>
          <Text style={styles.avatarName}>Natali Romanova</Text>
          <Text style={styles.avatarEmail}>email@example.com</Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          console.log(item),
          (
            <View style={styles.postsWrapper}>
              <Image source={{ uri: item.photo }} style={styles.photoGallery} />
              <Text style={{ marginTop: 10, marginLeft: 10 }}>
                {item.picName}
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginLeft: 10,
                }}>
                <TouchableOpacity
                  style={styles.commentIcon}
                  onPress={() =>
                    navigation.navigate("Comments", {
                      photo: item.photo,
                      postId: item.id,
                    })
                  }>
                  <Feather
                    name="message-circle"
                    size={24}
                    color="#BDBDBD"
                    position="absolute"
                    top={0}
                  />
                  <Text style={styles.commentCount}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Map", { location: item.postLocation })
                  }>
                  <Feather
                    name="map-pin"
                    size={24}
                    color="#BDBDBD"
                    position="absolute"
                    top={15}
                  />
                  <Text style={styles.location}>{item.postAddress}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userWrapper: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 30,
  },
  avatarImg: {
    width: 60,
    height: 60,

    marginRight: 8,

    backgroundColor: "#f6f6f6",
    borderRadius: 16,
  },
  avatarName: {
    fontFamily: "Roboto-Regular",

    color: "#212121",
  },
  avatarEmail: {
    fontFamily: "Roboto-Regular",

    color: "rgba(33, 33, 33, 0.8)",
  },
  photoGallery: {
    width: 343,
    height: 240,
  },
  postsWrapper: {
    marginHorizontal: 26,
    marginTop: 20,
  },
  location: {
    position: "relative",
    height: 50,
    color: "#000000",
    marginTop: 10,
    paddingLeft: 28,
    padding: 10,
  },
  commentIcon: {
    marginTop: 16,
    marginRight: 80,
  },
  commentCount: {
    position: "relative",
    color: "#000000",
    paddingLeft: 28,
    padding: 4,
  },
});