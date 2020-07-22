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
  "https://images.pexels.com/photos/3046632/pexels-photo-3046632.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/2203132/pexels-photo-2203132.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/2529787/pexels-photo-2529787.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
];

const ProductOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setIsError] = useState();
  const products = useSelector((state) => state.products.availableProducts);
  // console.log(products);

  const featuredProduct = products.filter((el) => el.isfeatured === true);
  // console.log(featuredProduct);

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setIsError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productActions.setProducts());
    } catch (err) {
      setIsError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsError, setIsLoading]);

  useEffect(() => {
    dispatch(adminActions.isAdmin());
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
      <View style={{ marginTop: 10, width: "100%", height: 300 }}>
        <Slider images={images} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>Featured Products</Text>
      </View>
      <FlatList
        data={featuredProduct}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onSelect={() => {
              SelectHandler(itemData.item.id, itemData.item.title);
            }}
          >
            <Button
              color={Colors.primary}
              title="View Details"
              onPress={() => {
                SelectHandler(itemData.item.id, itemData.item.title);
              }}
            />
            <Button
              color={Colors.primary}
              title="Add to Cart"
              onPress={() => {
                AddToCart(itemData.item);
              }}
            />
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
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onSelect={() => {
              SelectHandler(itemData.item.id, itemData.item.title);
            }}
          >
            <Button
              color={Colors.primary}
              title="View Details"
              onPress={() => {
                SelectHandler(itemData.item.id, itemData.item.title);
              }}
            />
            <Button
              color={Colors.primary}
              title="Add to Cart"
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
    marginTop: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: "open-sans-bold",
    fontSize: 22,
  },
});

export default ProductOverviewScreen;
