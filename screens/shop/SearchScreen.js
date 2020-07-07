import React, { useState } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet, FlatList, Button } from "react-native";
import { SearchBar } from "react-native-elements";
import SearchItem from "../../components/shop/SearchItem";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

const SearchScreen = (props) => {
  const [searchData, setSearchData] = useState([]);
  const [search, setIsSearch] = useState("");

  const products = useSelector((state) => state.products.availableProducts);

  const SelectHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  const searchFilter = (text) => {
    setIsSearch(text);
    const newData = products.filter((item) => {
      const itemData = item.title.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setSearchData(newData);
  };
  const clearSearchData = () => {
    setSearchData([]);
    props.navigation.navigate("Products");
  };

  const goHome = () => {
    props.navigation.navigate("Products");
  };
  return (
    <View>
      <SearchBar
        platform="android"
        placeholder="Search Products"
        lightTheme={true}
        onChangeText={(text) => searchFilter(text)}
        value={search}
        onClear={clearSearchData}
      />
      <FlatList
        data={searchData}
        renderItem={({ item }) => (
          <SearchItem
            title={item.title}
            source={item.imageUrl}
            onSelect={() => {
              SelectHandler(item.id, item.title);
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        // ItemSeparatorComponent={this.renderSeparator}
        // ListHeaderComponent={this.renderHeader}
      />
      <View style={styles.buttonContainer}>
        <Button title="Go back" onPress={goHome} />
      </View>
    </View>
  );
};

SearchScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Search Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName="md-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    margin: 10,
  },
});

export default SearchScreen;
