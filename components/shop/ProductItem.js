import React from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";

const ProductItem = (props) => {
  return (
    <View style={styles.product}>
      <View style={styles.touchable}>
        <TouchableNativeFeedback onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.img} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>${props.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>{props.children}</View>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  product: {
    margin: 15,
    // alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    borderRadius: 10,
    backgroundColor: "white",
    height: 300,
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 18,
    marginVertical: 2,
    fontFamily: "open-sans-bold",
  },
  price: {
    fontSize: 14,
    color: "#888",
    fontFamily: "open-sans",
  },
  details: {
    alignItems: "center",
    height: "15%",
    padding: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    height: "25%",
  },
});

export default ProductItem;
