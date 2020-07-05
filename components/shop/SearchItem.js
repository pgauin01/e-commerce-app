import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchItem = (props) => {
  return (
    <View>
      <TouchableNativeFeedback onPress={props.onSelect}>
        <View style={styles.searchItem}>
          <View style={styles.imgContainer}>
            <Image style={styles.img} source={{ uri: props.source }} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>{props.title}</Text>
          </View>
          <View style={styles.icon}>
            <Ionicons name="md-arrow-forward" size={23} color="white" />
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  searchItem: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 1,
    backgroundColor: "lightgrey",
  },
  imgContainer: {
    width: "30%",
    height: "100%",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontFamily: "open-sans",
  },
  icon: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchItem;
