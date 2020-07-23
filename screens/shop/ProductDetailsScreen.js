import React from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  Button,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/Cart";

const ProductDetailsScreen = (props) => {
  const ProductId = props.navigation.getParam("productId");
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === ProductId)
  );
  console.log(selectedProduct.inStock);
  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.layoutDir}>
        <Text style={styles.titleText}>{selectedProduct.title}</Text>
      </View>
      <View style={styles.layoutDir}>
        <Text style>Price:</Text>
        <Text style={styles.price}>₹{selectedProduct.price.toFixed(2)}</Text>
      </View>
      <View style={styles.layoutDir}>
        {/* <Text>Desciption</Text> */}
        <Text style={styles.description}>{selectedProduct.description}</Text>
      </View>
      <View style={styles.action}>
        <Button
          color={Colors.primary}
          title={selectedProduct.inStock ? "add to cart" : "Out of Stock"}
          disabled={!selectedProduct.inStock}
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />
      </View>
      {/* <Text style={styles.price}>₹{selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text> */}
    </ScrollView>
  );
};

ProductDetailsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("productTitle"),
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  titleText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  action: {
    marginVertical: 10,
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    // textAlign: "center",
    // marginVertical: 10,
    color: "#888",
    fontFamily: "open-sans-bold",
  },
  description: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "open-sans",
  },
  layoutDir: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
});

export default ProductDetailsScreen;
