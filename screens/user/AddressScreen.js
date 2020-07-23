import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import Colors from "../../constants/Colors";
import Address from "../../components/shop/UserAddress";
import * as addressActions from "../../store/actions/Address";
import { useDispatch, useSelector } from "react-redux";

const AddressScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setIsError] = useState();

  const userAddress = useSelector((state) => state.address.useraddress);

  const dispatch = useDispatch();

  const loadAddress = useCallback(async () => {
    setIsError(null);
    setIsLoading(true);
    try {
      await dispatch(addressActions.fetchAddress());
    } catch (err) {
      setIsError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsError]);

  useEffect(() => {
    loadAddress();
  }, [dispatch]);

  const editAddress = (id) => {
    props.navigation.navigate("EditAddress", {
      adderssId: id,
    });
  };

  const addAddress = () => {
    props.navigation.navigate("EditAddress");
  };

  const deleteAddressHandler = (id) => {
    Alert.alert("Are you sure?", "Do you really want to delete this item?", [
      { text: "No", style: "default" },
      {
        text: "Yes ",
        style: "destructive",
        onPress: () => {
          dispatch(addressActions.deleteAddress(id));
        },
      },
    ]);
  };
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (userAddress.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.textImage}>No Address Found</Text>
        <Image
          style={styles.image}
          source={{
            uri:
              "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/assests%2Flocation%20(1).png?alt=media&token=ed7eb7bf-b3a5-41d4-b6e2-0616c9acd71c",
          }}
        />
        <View style={styles.buttons}>
          <Button
            title="Add New Address"
            color={Colors.primary}
            onPress={addAddress}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.address}>
      <FlatList
        style={styles.list}
        data={userAddress}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <Address
            name={itemData.item.name}
            mobile={itemData.item.mobile}
            street={itemData.item.street}
            building={itemData.item.building}
          >
            <View style={styles.action}>
              <Button
                title="Edit"
                color={Colors.primary}
                onPress={() => {
                  editAddress(itemData.item.id);
                }}
              />
              <Button
                color={Colors.primary}
                title="Delete"
                onPress={() => {
                  deleteAddressHandler(itemData.item.id);
                }}
              />
            </View>
          </Address>
        )}
      />
    </View>
  );
};
AddressScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Address",
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Edit"
          iconName="md-create"
          onPress={() => {
            navData.navigation.navigate("EditAddress");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  address: {
    margin: 10,
  },

  action: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
});

export default AddressScreen;
