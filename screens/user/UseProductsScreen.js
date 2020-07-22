import React from "react";
import { FlatList, Button, Alert, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import * as productActions from "../../store/actions/Products";
import * as adminActions from "../../store/actions/Admin";

import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";

const UserProductsScreen = (props) => {
  const userProduct = useSelector((state) => state.products.userProducts);
  const dispatch = useDispatch();
  const editProdutHandler = (id) => {
    props.navigation.navigate("EditProduct", {
      productId: id,
    });
  };
  const deleteHandler = (id, imgName) => {
    Alert.alert("Are you sure?", "Do you really want to delete this item?", [
      { text: "No", style: "default" },
      {
        text: "Yes ",
        style: "destructive",
        onPress: () => {
          dispatch(productActions.deleteItem(id, imgName));
        },
      },
    ]);
  };
  if (userProduct.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Products found.</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={userProduct}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProdutHandler(itemData.item.id);
          }}
        >
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editProdutHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={() =>
              deleteHandler(itemData.item.id, itemData.item.imgName)
            }
          />
        </ProductItem>
      )}
    />
  );
};

UserProductsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Products",
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
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default UserProductsScreen;
