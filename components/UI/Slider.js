import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";

const DEVICE_WIDTH = Dimensions.get("window").width;

class Crousel extends Component {
  scrollRef = React.createRef();

  state = {
    selectedIndex: 0,
  };

  componentDidMount = () => {
    setInterval(() => {
      this.setState(
        (prev) => ({
          selectedIndex:
            prev.selectedIndex === this.props.images.length - 1
              ? 0
              : prev.selectedIndex + 1,
        }),
        () => {
          this.scrollRef.current.scrollTo({
            animated: true,
            y: 0,
            x: DEVICE_WIDTH * this.state.selectedIndex,
          });
        }
      );
    }, 3000);
  };
  changeSelectedIndex = ({ nativeEvent }) => {
    const viewSize = nativeEvent.layoutMeasurement.width;

    const contentOffset = nativeEvent.contentOffset.x;

    const selectedIndex = Math.floor(contentOffset / viewSize);

    this.setState({ selectedIndex });
  };
  render() {
    const { images } = this.props;
    const { selectedIndex } = this.state;

    return (
      <View style={{ height: "100%", width: "100%" }}>
        <ScrollView
          horizontal
          pagingEnabled
          onMomentumScrollEnd={this.changeSelectedIndex}
          ref={this.scrollRef}
        >
          {images.map((image) => (
            <Image
              key={image}
              source={{ uri: image }}
              style={styles.backgroundImage}
            />
          ))}
        </ScrollView>
        <View style={styles.circleDiv}>
          {images.map((image, index) => (
            <View
              key={image}
              style={[
                styles.whiteCircle,
                { opacity: index === selectedIndex ? 0.5 : 1 },
              ]}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: "100%",
    width: DEVICE_WIDTH,
    // resizeMode: "cover",
  },
  circleDiv: {
    position: "absolute",
    bottom: 15,
    height: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  whiteCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 5,
    backgroundColor: "#fff",
  },
});

export default Crousel;
