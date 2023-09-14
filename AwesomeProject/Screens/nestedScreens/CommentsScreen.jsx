import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  Keyboard,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

import { db } from "../../firebase/config";
import foto from "../../assets/images/AvatarPhoto.png";

export const CommentsScreen = ({ route }) => {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  const { userId, login } = useSelector((state) => state.auth);
  const { photo, postId } = route.params;

  useEffect(() => {
    getCommentList();
  }, []);

  const createComment = async () => {
    const uniqName = Date.now().toString();
    await setDoc(doc(db, "posts", postId, "comments", uniqName), {
      login,
      comment,
      userId,
      createdAt: commentDate(),
    });
    keyboardHide();
    setComment("");
  };

  const getCommentList = async () => {
    const querySnapshot = await getDocs(
      collection(db, "posts", postId, "comments")
    );
    if (querySnapshot) {
      setCommentList(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    }
  };

  const keyboardHide = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <View style={styles.picturePost}>
          <Image source={{ uri: photo }} style={styles.Image} />
        </View>
        <FlatList
          data={commentList}
          renderItem={({ item }) => (
            <View
              style={
                item.userId === userId
                  ? styles.commentBox
                  : { ...styles.commentBox, flexDirection: "row-reverse" }
              }>
              <View style={styles.commentPostWrapper}>
                <Text style={styles.commentPost}>{item.comment}</Text>
                <Text style={styles.commentDate}>{item.createdAt}</Text>
              </View>
              <View style={styles.commentAvatar}>
                {foto ? (
                  <Image style={styles.commentAvatar} source={foto} />
                ) : null}
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <TextInput
          placeholderTextColor={"#BDBDBD"}
          placeholder={"Коментувати..."}
          value={comment}
          style={styles.input}
          selectionColor={"#FF6C00"}
          onChangeText={setComment}
        />
        <TouchableOpacity style={styles.iconBtn} onPress={createComment}>
          <Feather name="send" size={18} color="#fff" style={styles.iconSend} />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  picturePost: {
    marginTop: 32,
    marginBottom: 16,
  },
  Image: {
    height: 240,
    borderRadius: 8,
  },
  input: {
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 20,
    padding: 12,
    color: "#212121",
    fontSize: 15,
    marginBottom: 10,
  },
  iconSend: {},
  iconBtn: {
    position: "absolute",
    right: 20,
    bottom: 15,
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: "center",
    borderColor: "#FF6C00",
    backgroundColor: "#FF6C00",
    justifyContent: "center",
  },
  commentBox: {
    marginBottom: 24,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  commentPostWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderBottomEndRadius: 6,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    padding: 16,
    width: 250,
    flexGrow: 1,
  },
  commentPost: {
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    color: "#212121",
  },
  commentDate: {
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    color: "#bdbdbd",
  },
  commentAvatar: {
    borderRadius: 100,
    width: 28,
    height: 28,
    backgroundColor: "#BDBDBD",
  },
});

const commentDate = () => {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours();
  let min = date.getMinutes();

  if (day.length === 1) {
    day = "0" + day;
  }

  if (month.length === 1) {
    month = "0" + month;
  }

  if (hours.length === 1) {
    hours = "0" + hours;
  }

  if (min.length === 1) {
    min = "0" + min;
  }

  return `${day} ${month} ${year} | ${hours}:${min}`;
};