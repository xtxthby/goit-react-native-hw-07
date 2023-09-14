import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  onSnapshot,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import img from "../../assets/images/PhotoBG.png";
import foto from "../../assets/images/AvatarPhoto.png";

export const ProfileScreen = () => {
  const [posts, setPosts] = useState([]);
  const { userId, login } = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handlerSignOut = () => {
    dispatch(authSignOutUser());
  };

  const getPosts = async () => {
    try {
      const ref = await collection(db, "posts");
      const filter = query(ref, where("userId", "==", userId));
      onSnapshot(filter, (snapshot) => {
        const posts = [];
        snapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id });
        });
        posts.sort((a, b) => b.createdAt - a.createdAt);
        setPosts(posts);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const updateLikes = async (likes, itemId) => {
    try {
      const likeRef = doc(db, "posts", itemId);
      await updateDoc(likeRef, {
        likes,
      });
    } catch (error) {
      console.log("err", error.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <ImageBackground style={styles.imgBg} source={img}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image source={foto} style={styles.avatarImage} />
          {!foto ? (
            <TouchableOpacity style={styles.btnAddAvatar} activeOpacity={0.9}>
              <Ionicons name="add" size={20} color="#FF6C00" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnRemoveAvatar}
              activeOpacity={0.9}>
              <Ionicons name="close" size={20} color="#E8E8E8" />
            </TouchableOpacity>
          )}
          <View style={{ marginLeft: 30 }}>
            <Text style={{ fontSize: 30, fontFamily: "Roboto-Regular" }}>
              {login}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handlerSignOut} title="logOut" color="#fff">
          <Feather
            name="log-out"
            size={24}
            color="#BDBDBD"
            marginLeft={320}
            marginTop={10}
          />
        </TouchableOpacity>
        <FlatList
          style={{ marginTop: 60 }}
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            console.log(item),
            (
              <View style={styles.postsWrapper}>
                <Image
                  source={{ uri: item.photo }}
                  style={styles.photoGallery}
                />
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
                    style={{ marginLeft: 10 }}
                    onPress={() => {
                      updateLikes(item.likes + 1, item.id);
                    }}>
                    <Feather
                      name="thumbs-up"
                      position="absolute"
                      top={15}
                      right={20}
                      size={24}
                      color={item.likes > 0 ? "#FF6C00" : "#BDBDBD"}
                    />
                    <Text
                      style={{
                        ...styles.commentLikes,
                        color: "#BDBDBD",
                      }}>
                      {item.likes}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Map", {
                        location: item.postLocation,
                      })
                    }>
                    <Feather
                      name="map-pin"
                      size={24}
                      color="#BDBDBD"
                      position="absolute"
                      top={15}
                      left={40}
                    />
                    <Text style={styles.location}>{item.postAddress}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "80%",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    position: "relative",
  },
  imgBg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  avatarContainer: {
    position: "absolute",
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    top: -60,
    alignSelf: "center",
    marginHorizontal: "auto",
    width: 120,
    height: 120,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  btnAddAvatar: {
    position: "absolute",
    bottom: 14,
    right: -12.5,
    justifyContent: "center",
    alignItems: "center",
    width: 25,
    height: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#FF6C00",
  },
  btnRemoveAvatar: {
    position: "absolute",
    bottom: 14,
    right: -12.5,
    justifyContent: "center",
    alignItems: "center",
    width: 25,
    height: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E8E8E8",
  },
  postsWrapper: {
    marginHorizontal: 26,
    marginTop: 20,
  },
  photoGallery: {
    borderRadius: 10,
    width: 343,
    height: 240,
  },
  commentIcon: {
    marginTop: 16,
    marginRight: 70,
  },
  commentCount: {
    position: "relative",
    color: "#000000",
    paddingLeft: 28,
    padding: 4,
  },
  commentLikes: {
    position: "relative",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    fontWeight: 400,
    marginTop: 16,
    color: "#000000",
    paddingLeft: 10,
    padding: 4,
  },
  location: {
    position: "relative",
    height: 50,
    color: "#000000",
    marginTop: 10,
    paddingLeft: 68,
    padding: 10,
  },
});