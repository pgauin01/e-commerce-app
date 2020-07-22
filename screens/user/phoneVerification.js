import React, { useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";

import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyAKt575GdMEOih-L5wNvEsHxUM75XCRK_U",
  authDomain: "e-commerce-app-b62a8.firebaseapp.com",
  databaseURL: "https://e-commerce-app-b62a8.firebaseio.com",
  projectId: "e-commerce-app-b62a8",
  storageBucket: "e-commerce-app-b62a8.appspot.com",
  messagingSenderId: "231876068069",
  appId: "1:231876068069:web:3ca20eb9464bda835f0a0c",
  measurementId: "G-W9EMG2GMKE",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default function PhoneAuthScreen() {
  const recaptchaVerifier = React.useRef(null);
  const verificationCodeTextInput = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [verifyError, setVerifyError] = useState();
  const [verifyInProgress, setVerifyInProgress] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmError, setConfirmError] = useState();
  const [confirmInProgress, setConfirmInProgress] = useState(false);
  const isConfigValid = !!firebaseConfig;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
        {/* <Text style={styles.title}>Go Kart</Text> */}
        {/* <Text style={styles.subtitle}>using expo-firebase-recaptcha</Text> */}
        <Text style={styles.text}>Enter phone number</Text>
        <TextInput
          style={styles.textInput}
          autoFocus={isConfigValid}
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          placeholder="+91"
          editable={!verificationId}
          onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
        />
        <Button
          title={`${verificationId ? "Resend" : "Send"} Verification Code`}
          disabled={!phoneNumber}
          onPress={async () => {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            try {
              setVerifyError(undefined);
              setVerifyInProgress(true);
              setVerificationId("");
              const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                // @ts-ignore
                recaptchaVerifier.current
              );
              setVerifyInProgress(false);
              setVerificationId(verificationId);
              verificationCodeTextInput.current?.focus();
            } catch (err) {
              setVerifyError(err);
              setVerifyInProgress(false);
            }
          }}
        />
        {verifyError && (
          <Text style={styles.error}>{`Error: ${verifyError.message}`}</Text>
        )}
        {verifyInProgress && <ActivityIndicator style={styles.loader} />}
        {verificationId ? (
          <Text style={styles.success}>
            A verification code has been sent to your phone
          </Text>
        ) : (
          undefined
        )}
        <Text style={styles.text}>Enter verification code</Text>
        <TextInput
          ref={verificationCodeTextInput}
          style={styles.textInput}
          editable={!!verificationId}
          placeholder=""
          onChangeText={(verificationCode) =>
            setVerificationCode(verificationCode)
          }
        />
        <Button
          title="Confirm Verification Code"
          disabled={!verificationCode}
          onPress={async () => {
            try {
              setConfirmError(undefined);
              setConfirmInProgress(true);
              const credential = new firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
              );
              const authResult = await firebase
                .auth()
                .signInWithCredential(credential);
              console.log(authResult);
              setConfirmInProgress(false);
              setVerificationId("");
              setVerificationCode("");
              verificationCodeTextInput.current?.clear();
              Alert.alert("Phone authentication successful!");
            } catch (err) {
              setConfirmError(err);
              setConfirmInProgress(false);
            }
          }}
        />
        {confirmError && (
          <Text style={styles.error}>{`Error: ${confirmError.message}`}</Text>
        )}
        {confirmInProgress && <ActivityIndicator style={styles.loader} />}
      </View>
      {!isConfigValid && (
        <View style={styles.overlay} pointerEvents="none">
          <Text style={styles.overlayText}>
            To get started, set a valid FIREBASE_CONFIG in App.tsx.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    marginTop: 10,
  },
  title: {
    marginBottom: 2,
    fontSize: 29,
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 10,
    opacity: 0.35,
    fontWeight: "bold",
  },
  text: {
    marginTop: 30,
    marginBottom: 4,
  },
  textInput: {
    marginBottom: 8,
    fontSize: 17,
    fontWeight: "bold",
  },
  error: {
    marginTop: 10,
    fontWeight: "bold",
    color: "red",
  },
  success: {
    marginTop: 10,
    fontWeight: "bold",
    color: "blue",
  },
  loader: {
    marginTop: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFFC0",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    fontWeight: "bold",
  },
});
