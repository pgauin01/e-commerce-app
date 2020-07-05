import React, { useEffect, useState, useCallback } from "react";
import { SearchBar } from "react-native-elements";
import {
  FlatList,
  Text,
  Button,
  ActivityIndicator,
  View,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/Cart";
import * as productActions from "../../store/actions/Products";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import SearchItem from "../../components/shop/SearchItem";

const ProductOverviewScreen = (props) => {
  const [searchData, setSearchData] = useState([]);
  const [search, setIsSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setIsError] = useState();
  const products = useSelector((state) => state.products.availableProducts);
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
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );
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

  const searchFilter = (text) => {
    setIsSearch(text);
    const newData = products.filter((item) => {
      const itemData = item.title.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setSearchData(newData);
  };
  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        placeholder="Search Products"
        lightTheme={true}
        onChangeText={(text) => searchFilter(text)}
        value={search}
      />
      <FlatList
        data={searchData}
        renderItem={({ item }) => (
          <SearchItem
            title={item.title}
            source={item.imageUrl}
            onSelect={() => {
              SelectHandler(item.id, item.title);
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        // ItemSeparatorComponent={this.renderSeparator}
        // ListHeaderComponent={this.renderHeader}
      />
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
            ViewDetails={() => {
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
                dispatch(cartActions.addToCart(itemData.item));
              }}
            />
          </ProductItem>
        )}
      />
    </View>
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
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Cart"
          iconName="md-cart"
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductOverviewScreen;
