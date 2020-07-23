import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Picker,
  Image,
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
  const address = useSelector((state) => state.address.useraddress);
  const loadedAddress = [];
  for (const key in address) {
    loadedAddress.push({
      id: key,
      name: address[key].name,
      data: `${address[key].name}  ${address[key].street}`,
      address: `${address[key].street}  ${address[key].building}`,
      mobile: address[key].mobile,
    });
  }
  const [cart, setCart] = useState("");
  const [touched, setIsTouched] = useState(false);
  const [isLoading, setIsLoding] = useState(false);
  const [addressChange, setAddressChange] = useState(0);

  // console.log(addressChange);

  const dispatch = useDispatch();
  const validity = useSelector((state) => state.cart.validity);
  const TotalAmount = useSelector((state) => state.cart.totalAmount);

  let DeliveryCharge;
  let FinalAmount;
  if (TotalAmount > 100) {
    DeliveryCharge = 0;
  } else if (TotalAmount < 100) {
    DeliveryCharge = 30;
  }

  FinalAmount = TotalAmount + DeliveryCharge;

  // console.log(loadedAddress);

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

  const loadOffer = async () => {
    try {
      await dispatch(cartActions.offer(cart));
    } catch (err) {
      console.log(err.message);
    }
  };

  const onOrderHandler = async () => {
    setIsLoding(true);
    await dispatch(
      orderActions.order(
        cartItem,
        TotalAmount,
        loadedAddress[addressChange],
        cartItem.prodImg
      )
    );
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

  const orderChangeHandler = (itemValue) => {
    setAddressChange(itemValue);
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
  let orderButton;
  if (loadedAddress.length === 0) {
    orderButton = (
      <Button
        title="continue"
        color={Colors.secondary}
        onPress={() => {
          props.navigation.navigate("EditAddress");
        }}
      />
    );
  }
  if (loadedAddress.length > 0) {
    orderButton = (
      <Button
        title="Order Now"
        color={Colors.secondary}
        disabled={cartItem.length === 0}
        onPress={onOrderHandler}
      />
    );
  }

  if (cartItem.length == 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.textImage}>No products found in cart</Text>
        <Image
          style={styles.image}
          source={{
            uri:
              "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/assests%2Fempty-cart.png?alt=media&token=853ebacb-ce8e-44b3-83e0-9a05fa6b6905",
          }}
        />
        <View style={styles.buttons}>
          <Button
            title="Start Shopping "
            color={Colors.primary}
            onPress={() => {
              props.navigation.navigate("ProductsOverview");
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cartscreen}>
      {loadedAddress.length > 0 ? (
        <View style={styles.address}>
          <View style={styles.addressText}>
            <Text style={styles.addText}>Address:</Text>
          </View>
          <View style={styles.addressPicker}>
            <Picker
              selectedValue={addressChange}
              style={{ height: 30, width: "100%" }}
              onValueChange={(itemValue) => orderChangeHandler(itemValue)}
            >
              {loadedAddress.map((el) => {
                return (
                  <Picker.Item key={el.id} label={el.data} value={el.id} />
                );
              })}
            </Picker>
          </View>
        </View>
      ) : null}

      <View style={styles.summary}>
        <View>
          <View style={styles.textPadd}>
            <Text style={styles.summaryText}>
              Cart Amount:
              <Text style={styles.price}>
                ${Math.round(TotalAmount.toFixed(2) * 100) / 100}
              </Text>
            </Text>
          </View>
          <View style={styles.textPadd}>
            <Text style={styles.summaryText}>
              DeliveryCharge:
              <Text style={styles.price}>
                ${Math.round(DeliveryCharge.toFixed(2) * 100) / 100}
              </Text>
            </Text>
          </View>
          <View style={styles.textPadd}>
            <Text style={styles.summaryTextBold}>
              Total Amount:
              <Text style={styles.price}>
                ${Math.round(FinalAmount.toFixed(2) * 100) / 100}
              </Text>
            </Text>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          orderButton
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
  address: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
  },
  addressText: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  addressPicker: {
    width: "80%",
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
    fontFamily: "open-sans",
    fontSize: 16,
  },
  summaryTextBold: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  price: {
    fontFamily: "open-sans",
    fontSize: 16,
    // color: Colors.primary,
  },
  textPadd: {
    paddingBottom: 5,
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
  image: {
    width: 128,
    height: 128,
  },
  textImage: {
    paddingBottom: 10,
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  buttons: {
    paddingTop: 10,
  },
});

export default CartScreen;
