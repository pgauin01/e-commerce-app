import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Address = (props) => {
  return (
    <View style={styles.address}>
      <View style={styles.addressRow}>
        <Text style={styles.text}>{props.name}</Text>
        <Text style={styles.textBold}>{props.mobile}</Text>
      </View>
      <View style={styles.addressRow}>
        <Text style={styles.text}>{props.street}</Text>
        {/* <Text style={styles.text}>{props.building}</Text> */}
      </View>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  address: {
    margin: 10,
    padding: 15,
    elevation: 5,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  text: {
    fontFamily: "open-sans",
    fontSize: 18,
    // color: "white",
  },
  textBold: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
});

export default Address;
