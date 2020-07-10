import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  Picker,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import * as cartActions from "../../store/actions/Cart";

const CartItem = (props) => {
  const [selectedValue, setSelectedValue] = useState(props.quantity);

  const dispatch = useDispatch();

  const onQtyChangeHandler = (itemValue) => {
    setSelectedValue(itemValue);

    dispatch(cartActions.updateQty(itemValue, props.id));
  };

  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{props.quantity}</Text>
        <Image
          style={{ width: 30, height: 30, marginRight: 5 }}
          source={{ uri: props.source }}
        />
        <Text style={styles.mainText}>{props.title}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.mainText}>${props.amount.toFixed(2)}</Text>
        {props.deletable && (
          <TouchableNativeFeedback
            onPress={props.onRemove}
            style={styles.deleteBtn}
          >
            <Ionicons name="md-trash" size={23} color="red" />
          </TouchableNativeFeedback>
        )}
        {props.deletable && (
          <View style={styles.dropdown}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Qty:{props.quantity}</Text>
            </View>
            <Picker
              selectedValue={selectedValue}
              style={{ height: 30, width: 50 }}
              onValueChange={(itemValue) => onQtyChangeHandler(itemValue)}
            >
              <Picker.Item label="1" value={1} />
              <Picker.Item label="2" value={2} />
              <Picker.Item label="3" value={3} />
              <Picker.Item label="4" value={4} />
              <Picker.Item label="5" value={5} />
              <Picker.Item label="6" value={6} />
              <Picker.Item label="7" value={7} />
              <Picker.Item label="8" value={8} />
              <Picker.Item label="9" value={9} />
            </Picker>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 15,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontFamily: "open-sans-bold",
    color: "#888",
    fontSize: 16,
    marginRight: 5,
  },
  mainText: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
    marginRight: 10,
  },
  amount: {
    paddingRight: 10,
  },
  deleteBtn: {
    marginRight: 10,
  },
  labelContainer: {
    alignItems: "center",
    marginBottom: -12,
    justifyContent: "center",
    marginTop: 10,
  },
  labelText: {
    fontFamily: "open-sans-bold",
  },
  dropdown: {
    marginLeft: 10,
  },
});

export default CartItem;
