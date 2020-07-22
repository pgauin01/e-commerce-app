import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import Thunk from "redux-thunk";
import ProductReducer from "./store/reducers/Products";
import CartReducer from "./store/reducers/Cart";
import OrderReducer from "./store/reducers/orders";
import NavigationContainer from "./navigation/NavigationContainer";
import AuthReducer from "./store/reducers/Auth";
import AddressReducer from "./store/reducers/Address";
import AdminReducer from "./store/reducers/Admin";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { composeWithDevTools } from "redux-devtools-extension";

const rootReducer = combineReducers({
  products: ProductReducer,
  cart: CartReducer,
  orders: OrderReducer,
  auth: AuthReducer,
  address: AddressReducer,
  admin: AdminReducer,
});

const store = createStore(rootReducer, applyMiddleware(Thunk));

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
