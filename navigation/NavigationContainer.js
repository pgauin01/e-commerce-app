import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavigationActions } from "react-navigation";

import ShopNavigator from "./Shopnavigator";
import ShopNavigatorAdmin from "./ShopnavigatorAdmin";

const NavigationContainer = (props) => {
  const navRef = useRef();
  const isAuth = useSelector((state) => !!state.auth.token);
  const isAdmin = useSelector((state) => state.admin.isAdmin);
  // console.log(`nav${isAdmin}`);

  let Navigator;
  if (isAdmin) {
    Navigator = <ShopNavigator ref={navRef} />;
  } else {
    Navigator = <ShopNavigatorAdmin ref={navRef} />;
  }

  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);

  return Navigator;
};

export default NavigationContainer;
