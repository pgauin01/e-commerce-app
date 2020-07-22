import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import Colors from "../constants/Colors";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/Auth";

const StartupScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!userData) {
        props.navigation.navigate("Auth");
        return;
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);
      if (expirationDate <= new Date() || !token || !userId) {
        await dispatch(authActions.refreshData(refreshToken));
        props.navigation.navigate("Shop");
      }
      // const expirationTime = expirationDate.getTime() - new Date().getTime();
      dispatch(authActions.authenticate(token, userId));
      props.navigation.navigate("Shop");
    };

    tryLogin();
  }, [dispatch]);
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StartupScreen;
