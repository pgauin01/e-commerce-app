import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import firebase from "../../firebase";

const NewScreen = (props) => {
  const [ImageName, setImageName] = useState();
  const [pickedImage, setPickedImage] = useState();
  // console.log(pickedImage);

  const [loading, isLoading] = useState(false);
  // console.log(loading);
  const [image, setImage] = useState();
  const [preview, setIsPreview] = useState(false);
  // console.log(ImageName);

  // console.log(image);

  const onChooseImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
    setPickedImage(result.uri);

    if (!result.cancelled) {
      isLoading(true);

      uploadImage(result.uri)
        .then(() => {
          Alert.alert("Image Successfully Uploaded");
          isLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
        });
      setIsPreview(false);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const ImageNa = response._bodyBlob._data.blobId;
    setImageName(ImageNa);
    props.imgName(ImageNa);

    const blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("Images/" + ImageNa);
    return ref.put(blob);
  };

  const checkImage = () => {
    isLoading(true);

    const images = firebase
      .storage()
      .ref()
      .child("Images/");
    const image = images.child(ImageName);
    image.getDownloadURL().then((url) => {
      setImage(url);
      isLoading(false);
      props.ImageUrl(url);
    });
    setIsPreview(true);
  };

  const deleteImage = () => {
    // Create a reference to the file to delete
    isLoading(true);

    var desertRef = firebase
      .storage()
      .ref()
      .child(`Images/${ImageName}`);

    // Delete the file
    desertRef
      .delete()
      .then(function() {
        // File deleted successfully
        isLoading(false);

        Alert.alert("Image Successfully deleted");
      })
      .catch(function(error) {
        // Uh-oh, an error occurred!
      });
    setImage("");
    setPickedImage("");
    setIsPreview(false);
    props.deleteImage("");
  };

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <View style={styles.imagePreview}>
        {/* {!image ? (
          <Text>No image picker yet.</Text>
        ) : (
          <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
        )} */}
        {loading ? (
          <ActivityIndicator size="small" color="red" />
        ) : (
          <Image
            source={{ uri: pickedImage }}
            style={{ width: 100, height: 100 }}
          />
        )}
      </View>

      <View style={styles.action}>
        <Button title="Choose Image" onPress={onChooseImagePicker} />

        {preview ? (
          <Button title="delete" color="red" onPress={deleteImage} />
        ) : (
          <Button title="Confirm image" onPress={checkImage} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  action: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    // justifyContent: "center",
  },
});

export default NewScreen;
