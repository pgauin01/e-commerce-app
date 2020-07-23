import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import HeaderButton from "../../components/UI/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import Input from "../../components/UI/Input";
import * as addressActions from "../../store/actions/Address";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const EditAddressScreen = (props) => {
  const [error, setIsError] = useState();

  const dispatch = useDispatch();
  const AddId = props.navigation.getParam("adderssId");
  const editedAddress = useSelector((state) =>
    state.address.useraddress.find((addId) => addId.id === AddId)
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedAddress ? editedAddress.name : "",
      street: editedAddress ? editedAddress.street : "",
      building: editedAddress ? editedAddress.building : "",
      landmark: editedAddress ? editedAddress.landmark : "",
      state: editedAddress ? editedAddress.state : "",
      mobile: editedAddress ? editedAddress.mobile : "",
      locationType: editedAddress ? editedAddress.locationType : "",
    },
    inputValidities: {
      name: editedAddress ? true : false,
      street: editedAddress ? true : false,
      building: editedAddress ? true : false,
      landmark: editedAddress ? true : false,
      state: editedAddress ? true : false,
      mobile: editedAddress ? true : false,
      locationType: editedAddress ? true : false,
    },
    formIsValid: editedAddress ? true : false,
  });

  // console.log(formState.formIsValid);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }

    setIsError(null);

    try {
      if (editedAddress) {
        await dispatch(
          addressActions.updateAddress(
            AddId,
            formState.inputValues.name,
            formState.inputValues.street,
            formState.inputValues.building,
            formState.inputValues.landmark,
            formState.inputValues.state,
            formState.inputValues.mobile,
            formState.inputValues.locationType
          )
        );
      } else {
        await dispatch(
          addressActions.addAddress(
            formState.inputValues.name,
            formState.inputValues.street,
            formState.inputValues.building,
            formState.inputValues.landmark,
            formState.inputValues.state,
            formState.inputValues.mobile,
            formState.inputValues.locationType
          )
        );
      }
    } catch (err) {
      setIsError(err.message);
      console.log(err.message);
    }

    props.navigation.goBack();
  }, [formState, dispatch]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          id="name"
          label="Name *"
          errorText="Please enter a valid name!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={editedAddress ? editedAddress.name : ""}
          initiallyValid={!!editedAddress}
          required
        />
        <Input
          id="street"
          label="Street *"
          errorText="Please enter street Address"
          keyboardType="default"
          returnKeyType="next"
          multiline
          numberOfLines={3}
          onInputChange={inputChangeHandler}
          initialValue={editedAddress ? editedAddress.street : ""}
          initiallyValid={!!editedAddress}
          required
        />

        <Input
          id="building"
          label="Building *"
          errorText="Please enter a building!"
          keyboardType="default"
          returnKeyType="next"
          initialValue={editedAddress ? editedAddress.building : ""}
          onInputChange={inputChangeHandler}
          initiallyValid={editedAddress ? editedAddress.landmark : ""}
          required
        />

        <Input
          id="landmark"
          label="Landmark"
          errorText="Please enter a landmark!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          onInputChange={inputChangeHandler}
          initialValue={editedAddress ? editedAddress.landmark : ""}
          initiallyValid={true}
        />

        <Input
          id="state"
          label="State *"
          errorText="Please enter state!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          onInputChange={inputChangeHandler}
          initialValue={editedAddress ? editedAddress.state : ""}
          initiallyValid={!!editedAddress}
          required
          minLength={5}
        />

        <Input
          id="mobile"
          label="Mobile *"
          errorText="Please enter mobile Number!"
          keyboardType="decimal-pad"
          onInputChange={inputChangeHandler}
          initialValue={editedAddress ? editedAddress.mobile : ""}
          initiallyValid={!!editedAddress}
          required
          minLength={10}
        />

        <Input
          id="locationType"
          label="LocationType"
          errorText="Please enter locationType!"
          keyboardType="default"
          onInputChange={inputChangeHandler}
          initialValue={editedAddress ? editedAddress.locationType : ""}
          initiallyValid={true}
        />
      </View>
    </ScrollView>
  );
};
EditAddressScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");

  return {
    headerTitle: navData.navigation.getParam("adderssId")
      ? "Edit Address"
      : "Add New Address",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});

export default EditAddressScreen;
