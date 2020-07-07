import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import CartItems from "../../components/shop/CartItems";
import * as cartActions from "../../store/actions/Cart";
import * as orderActions from "../../store/actions/orders";
import * as productActions from "../../store/actions/Products";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";

// import CartItems from "../../components/shop/CartItems";

const CartScreen = (props) => {
  const [cart, setCart] = useState("");
  const [touched, setIsTouched] = useState(false);
  const [isLoading, setIsLoding] = useState(false);
  const dispatch = useDispatch();
  const validity = useSelector((state) => state.cart.validity);
  const TotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItem = useSelector((state) => {
    const cartItems = [];
    for (const key in state.cart.items) {
      cartItems.push({
        productId: key,
        productTitle: state.cart.items[key].title,
        productPrice: state.cart.items[key].price,
        quantity: state.cart.items[key].quantity,
        productTotal: state.cart.items[key].total,
        prodImg: state.cart.items[key].imageUrl,
      });
    }

    return cartItems.sort((a, b) => (a.productId > b.productId ? 1 : 1));
  });
  // console.log(cartItem.prodImg);

  const loadOffer = async () => {
    try {
      await dispatch(cartActions.offer(cart));
    } catch (err) {
      console.log(err.message);
    }
  };

  // useEffect(() => {
  //   loadOffer();
  // }, [loadOffer]);

  const onOrderHandler = async () => {
    setIsLoding(true);
    await dispatch(orderActions.order(cartItem, TotalAmount));
    setIsLoding(false);
  };

  const offerHandler = () => {
    if (cartItem.length > 0) {
      loadOffer();
      setTimeout(() => {
        setIsTouched(true);
      }, 1500);
    }
  };
  let validityContainer;
  if (touched && validity) {
    validityContainer = (
      <View style={styles.offerSection}>
        <Text style={styles.offerValid}>Coupon Successfully applied!</Text>
      </View>
    );
  }
  if (touched && validity === false) {
    validityContainer = (
      <View style={styles.offerSection}>
        <Text style={styles.offerinvalid}>
          Please Enter a valid coupon code!!!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.cartscreen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total Amount:{" "}
          <Text style={styles.price}>
            ${Math.round(TotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            title="Order Now"
            disabled={cartItem.length === 0}
            onPress={onOrderHandler}
          />
        )}
      </View>
      <View style={styles.couponContainer}>
        <Text style={styles.couponText}>
          Enter valid Coupon Code to get upto
          <Text style={styles.couponBold}> 70%</Text> off
        </Text>
      </View>
      <View style={styles.offerSection}>
        <TextInput
          style={styles.input}
          value={cart}
          onChangeText={(text) => setCart(text)}
        />
        <View style={styles.button}>
          <Button title="Check" onPress={offerHandler} />
        </View>
      </View>

      {validityContainer}
      <FlatList
        data={cartItem}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItems
            id={itemData.item.productId}
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.productPrice}
            source={itemData.item.prodImg}
            deletable
            onRemove={() => {
              dispatch(cartActions.deleteCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Cart",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName="md-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  cartscreen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  price: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: Colors.primary,
  },
  offerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    flex: 1,
  },
  button: {
    flex: 1,
  },

  couponContainer: {
    margin: 10,
  },
  couponText: {
    fontFamily: "open-sans",
  },
  couponBold: {
    fontFamily: "open-sans-bold",
  },
  offerinvalid: {
    color: "red",
    fontFamily: "open-sans-bold",
  },
  offerValid: {
    color: "green",
    fontFamily: "open-sans-bold",
  },
});

export default CartScreen;
