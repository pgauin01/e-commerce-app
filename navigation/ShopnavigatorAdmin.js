import React from "react";
import { Platform, SafeAreaView, Button, View } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import {
  createDrawerNavigator,
  DrawerNavigatorItems,
} from "react-navigation-drawer";
import { useDispatch } from "react-redux";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailsScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import CartScreen from "../screens/shop/CartScreen";
// import UserProductsScreen from "../screens/user/UseProductsScreen";
// import EditProductScreen from "../screens/user/EditProductScreen";
import GoogleAuthScreen from "../screens/user/GoogleAuthScreen";
// import PhoneAuthScreen from "../screens/user/phoneVerification";

import AuthScreen from "../screens/user/AuthScreen";
import SearchScreen from "../screens/shop/SearchScreen";
import StartupScreen from "../screens/StartupScreen";
import AddressScreen from "../screens/user/AddressScreen";
import EditAddressScreen from "../screens/user/EditAddressScreen";
import * as authActions from "../store/actions/Auth";

import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

// const adminNavigator = createStackNavigator(
//   {
//     UserProduct: UserProductsScreen,
//     EditProduct: EditProductScreen,
//   },
//   {
//     navigationOptions: {
//       drawerIcon: (drawerConfig) => (
//         <Ionicons
//           name={Platform.OS === "android" ? "md-create" : "ios-create"}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       ),
//     },
//     defaultNavigationOptions: defaultNavOptions,
//   }
// );

const SearchNavigator = createStackNavigator(
  {
    Search: SearchScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-search" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const AddressNavigator = createStackNavigator(
  {
    Address: AddressScreen,
    EditAddress: EditAddressScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-mail" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Search: SearchNavigator,
    Address: AddressNavigator,
    Orders: OrdersNavigator,
    // Admin: adminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, marginTop: 30 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerNavigatorItems {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout());
                // props.navigation.navigate("Auth");
              }}
            />
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
    GoogleAuth: GoogleAuthScreen,
    // PhoneAuth: PhoneAuthScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator,
});

export default createAppContainer(MainNavigator);
