import { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  Keyboard,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";
import foto from "../../assets/image/Rectangle.png";

function CommentsScreen({ route }) {
  const [isFocus, setIsFocus] = useState({
    send: false,
  });
  const [commentsList, setCommentsList] = useState("");
  const [message, setMessage] = useState("");
  const { userId, login } = useSelector((state) => state.auth);
  const { postId, photo } = route.params;
  console.log(commentsList);
  useEffect(() => {
    getCommentsList();
  }, []);

  const createComments = async () => {
    const uniqName = Date.now().toString();
    await setDoc(doc(db, "posts", postId, "comments", uniqName), {
      login,
      message,
      userId,
      createdAt: commentDate(),
    });
    keyboardHide();
    setMessage("");
  };

  const getCommentsList = async () => {
    const querySnapshot = await getDocs(
      collection(db, "posts", postId, "comments")
    );
    if (querySnapshot) {
      setCommentsList(
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
        <View style={styles.list}>
          <Image source={{ uri: photo }} style={styles.Image} />
        </View>
        <FlatList
          data={commentsList}
          renderItem={({ item }) => (
            <View
              style={
                item.userId === userId
                  ? styles.commentBox
                  : { ...styles.commentBox, flexDirection: "row-reverse" }
              }
            >
              <View style={styles.commentTextWrapper}>
                <Text style={styles.commentText}>{item.message}</Text>
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
          style={{
            ...styles.input,
            borderColor: isFocus.send ? "#FF6C00" : "#F6F6F6",
            backgroundColor: isFocus.send ? "#FFFFFF" : "#F6F6F6",
          }}
          selectionColor={"#FF6C00"}
          onFocus={() => {
            setIsFocus({
              ...isFocus,
              send: true,
            });
          }}
          onBlur={() => {
            setIsFocus({
              ...isFocus,
              send: false,
            });
          }}
          value={message}
          onChangeText={(value) => setMessage(value)}
        />
        <TouchableOpacity style={styles.iconBtn} onPress={createComments}>
          <Feather name="send" size={18} color="#fff" style={styles.iconSend} />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
export default CommentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  list: { marginTop: 32, marginBottom: 16 },

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
  Image: {
    height: 240,
    borderRadius: 8,
  },
  commentBox: {
    marginBottom: 24,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  commentTextWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 6,
    padding: 16,
    width: 250,
    flexGrow: 1,
  },
  commentDate: {
    fontFamily: "RobotoMono-Regular",
    fontSize: 10,
    color: "#bdbdbd",
  },
  commentText: {
    fontFamily: "RobotoMono-Regular",
    fontSize: 13,
    color: "#212121",
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