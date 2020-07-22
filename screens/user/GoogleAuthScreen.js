import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableNativeFeedback,
} from "react-native";
import * as authActions from "../../store/actions/Auth";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import * as Google from "expo-google-app-auth";

// const IOS_CLIENT_ID = "your-ios-client-id";
const ANDROID_CLIENT_ID =
  "231876068069-h0kbn2051ghnkd6ctmc16tudo122nmjs.apps.googleusercontent.com";

const LoginScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  // console.log(isLoading);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await Google.logInAsync({
        // iosClientId: IOS_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
        scopes: ["profile", "email"],
      });
      setIsLoading(false);

      // console.log(result.idToken);
      // console.log(result.user.id);
      setError(null);
      setIsLoading(true);
      try {
        await dispatch(authActions.Googlelogin(result.idToken));
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);

      if (result.type === "success") {
        console.log("LoginScreen.js.js 21 | ", result.user.givenName);
        props.navigation.navigate("Shop");
        //after Google login redirect to Profile
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log("LoginScreen.js.js 30 | Error with login", e);
      return { error: true };
    }
  };

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback onPress={signInWithGoogle}>
        {isLoading ? (
          <ActivityIndicator color="red" size="small" />
        ) : (
          <View style={styles.rowStyles}>
            <View>
              <Text style={styles.text}>Login with</Text>
            </View>
            <View
              style={{
                marginLeft: 10,
                backgroundColor: "transparent",
                marginRight: 5,
              }}
            >
              <Ionicons size={21} color="red" name="logo-google" />
            </View>
          </View>
        )}
      </TouchableNativeFeedback>
      {/* <Button
        color="black"
        title="Login with Google"
        onPress={signInWithGoogle}
      />
      <Ionicons size={21} color="red" name="logo-google" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop: 20,
    width: 150,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 5,
    borderRadius: 5,
  },
  text: {
    fontFamily: "open-sans",
    fontSize: 18,
    color: "#fff",
  },
  rowStyles: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
});

export default LoginScreen;
