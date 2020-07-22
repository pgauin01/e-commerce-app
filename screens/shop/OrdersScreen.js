import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import * as orderActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";

const OrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const order = useSelector((state) => state.orders.orders);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(orderActions.fetchOrders()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }
  if (order.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Products found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={order}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.redableDate}
          items={itemData.item.items}
          address={itemData.item.address.data}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flexDirection: "column-reverse",
  },
});

export default OrdersScreen;
