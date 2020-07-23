import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Text,
  Button,
  ActivityIndicator,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableNativeFeedback,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/Cart";
import * as productActions from "../../store/actions/Products";
import * as addressActions from "../../store/actions/Address";
import * as adminActions from "../../store/actions/Admin";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Slider from "../../components/UI/Slider";
import Colors from "../../constants/Colors";

const images = [
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/slider%2Fslide_1.png?alt=media&token=f4d512ba-7907-45c7-b69d-dac1b0e8f46e",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/slider%2Fslide_2.png?alt=media&token=57439c02-f4b9-4d88-b843-186fef0fa149",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/slider%2Fslide_3.png?alt=media&token=9f9eff25-25bb-4719-9350-10544baea706",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/slider%2Fslide_4.png?alt=media&token=b8c6e0dd-30dc-4ffe-8ab9-0d1c121edf56",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/slider%2Fslide_5.png?alt=media&token=6a5a6e11-fc3f-4fc5-92cd-3a53eae8ba0c",
];

const ProductOverviewScreen = (props) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setIsError] = useState();
  const products = useSelector((state) => state.products.availableProducts);

  const featuredProduct = products.filter((el) => el.isfeatured === true);
  // console.log(featuredProduct);

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setIsError(null);
    setIsRefreshing(true);
    setIsLoading(true);

    try {
      await dispatch(productActions.setProducts());
      setIsLoading(false);
    } catch (err) {
      setIsError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsError, setIsLoading]);

  useEffect(() => {
    setIsLoading(true);

    dispatch(adminActions.isAdmin());
    setIsLoading(false);
  }, [dispatch]);

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
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );
    loadAddress();

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

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

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Products Found</Text>
      </View>
    );
  }

  const SelectHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  const AddToCart = (item) => {
    dispatch(cartActions.addToCart(item));
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={loadProducts} />
      }
    >
      <View style={{ marginTop: 10, width: "100%", height: 230 }}>
        <Slider images={images} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>Today's Deal</Text>
      </View>
      <FlatList
        data={featuredProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={(itemData) => (
          <ProductItem
            single
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            oldPrice={itemData.item.oldprice}
            onSelect={() => {
              SelectHandler(itemData.item.id, itemData.item.title);
            }}
          >
            {/* <Button
              color={Colors.primary}
              title="View Details"
              onPress={() => {
                SelectHandler(itemData.item.id, itemData.item.title);
              }}
            /> */}

            <TouchableNativeFeedback
              onPress={() => {
                AddToCart(itemData.item);
              }}
            >
              <View style={styles.button}>
                <Text style={{ color: "white" }}>
                  {itemData.item.inStock ? "Add to Cart" : "Out of Stock"}
                </Text>
              </View>
            </TouchableNativeFeedback>

            {/* <Button
              color={Colors.primary}
              title={itemData.item.inStock ? "Add to Cart" : "Out of Stock"}
              disabled={!itemData.item.inStock}
              onPress={() => {
                AddToCart(itemData.item);
              }}
            /> */}
          </ProductItem>
        )}
      />
      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>All Products</Text>
      </View>
      <FlatList
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProductItem
            single
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            oldPrice={itemData.item.oldprice}
            onSelect={() => {
              SelectHandler(itemData.item.id, itemData.item.title);
            }}
          >
            {/* <Button
              color={Colors.primary}
              title="View Details"
              style={{ fontSize: 13 }}
              onPress={() => {
                SelectHandler(itemData.item.id, itemData.item.title);
              }}
            /> */}

            <Button
              color={Colors.primary}
              title={itemData.item.inStock ? "Add to Cart" : "Out of Stock"}
              disabled={!itemData.item.inStock}
              onPress={() => {
                AddToCart(itemData.item);
              }}
            />
          </ProductItem>
        )}
      />
    </ScrollView>
  );
};

ProductOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
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
      <View style={{ flexDirection: "row" }}>
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Search"
            iconName="md-search"
            onPress={() => {
              navData.navigation.navigate("Search");
            }}
          />
        </HeaderButtons>
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Cart"
            iconName="md-cart"
            onPress={() => {
              navData.navigation.navigate("Cart");
            }}
          />
        </HeaderButtons>
      </View>
    ),
  };
};
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    marginTop: 15,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: "open-sans-bold",
    fontSize: 22,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    elevation: 5,
    // borderRadius: 10,
  },
});

export default ProductOverviewScreen;
