import React, { useEffect, useCallback, useReducer, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import ImagePicker from "../../components/shop/ImagePicker";

import * as productsActions from "../../store/actions/Products";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

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

const EditProductScreen = (props) => {
  const prodId = props.navigation.getParam("productId");
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );
  const [checked, setIsChecked] = useState(
    editedProduct ? editedProduct.inStock : true
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setIsError] = useState();
  const [ImageName, setImageName] = useState();
  const [image, setImage] = useState();

  // console.log(editedProduct.inStock);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      // imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: editedProduct ? editedProduct.price : "",
      oldprice: editedProduct ? editedProduct.oldprice : "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      // imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
      oldprice: editedProduct ? editedProduct.oldprice : "",
    },
    formIsValid: editedProduct ? true : false,
  });
  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }

    // if (!image) {
    //   Alert.alert("Wrong image input!", "Please check the image input again", [
    //     { text: "Okay" },
    //   ]);
    //   return;
    // }
    setIsError(null);
    setIsLoading(true);
    try {
      if (editedProduct) {
        await dispatch(
          productsActions.updateItem(
            prodId,
            formState.inputValues.title,
            +formState.inputValues.price,
            formState.inputValues.description,
            checked,
            oldprice
          )
        );
      } else {
        await dispatch(
          productsActions.createItem(
            formState.inputValues.title,
            image,
            +formState.inputValues.price,
            formState.inputValues.description,
            ImageName,
            checked,
            oldprice
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setIsError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, prodId, formState, image, ImageName, checked]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

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
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const ImgNameHandler = (imgName) => {
    setImageName(imgName);
  };

  const ImgUrlHandler = (url) => {
    setImage(url);
  };

  const imgDeleteHandler = () => {
    setImage("");
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          id="title"
          label="Title"
          errorText="Please enter a valid title!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.title : ""}
          initiallyValid={!!editedProduct}
          required
        />
        {/* <Input
          id="imageUrl"
          label="Image Url"
          errorText="Please enter a valid image url!"
          keyboardType="default"
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.imageUrl : ""}
          initiallyValid={!!editedProduct}
          required
        /> */}
        {/* {editedProduct ? null : ( */}
        <Input
          id="oldprice"
          label="Old Price"
          errorText="Please enter a valid price!"
          keyboardType="decimal-pad"
          returnKeyType="next"
          initialValue={editedProduct ? editedProduct.oldprice.toString() : ""}
          onInputChange={inputChangeHandler}
          initiallyValid={!!editedProduct}
          required
          min={0.1}
        />
        <Input
          id="price"
          label="Price"
          errorText="Please enter a valid price!"
          keyboardType="decimal-pad"
          returnKeyType="next"
          initialValue={editedProduct ? editedProduct.price.toString() : ""}
          onInputChange={inputChangeHandler}
          initiallyValid={!!editedProduct}
          required
          min={0.1}
        />
        {/* // )} */}
        <Input
          id="description"
          label="Description"
          errorText="Please enter a valid description!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={3}
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.description : ""}
          initiallyValid={!!editedProduct}
          required
          minLength={5}
        />
        <View style={styles.radioButton}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 16 }}>
            Product Availability
          </Text>
          <RadioButton.Group
            onValueChange={(v) => {
              setIsChecked(v);
            }}
          >
            <View>
              <Text>InStock</Text>
              <RadioButton
                value={true}
                status={checked === true ? "checked" : "unchecked"}
                onPress={() => {
                  setIsChecked(true);
                }}
              />
            </View>
            <View>
              <Text>Out of Stock</Text>
              <RadioButton
                value={false}
                status={checked === false ? "checked" : "unchecked"}
                onPress={() => {
                  setIsChecked(false);
                }}
              />
            </View>
          </RadioButton.Group>
        </View>
        {editedProduct ? null : (
          <ImagePicker
            imgName={ImgNameHandler}
            ImageUrl={ImgUrlHandler}
            deleteImage={imgDeleteHandler}
          />
        )}
      </View>
    </ScrollView>
  );
};

EditProductScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
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
  radioButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    alignContent: "center",
  },
});

export default EditProductScreen;
