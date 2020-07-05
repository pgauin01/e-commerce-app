import PRODUCTS from "../../data/dummy-data";
import Product from "../../modals/Products";
import {
  DELETE_ITEM,
  CREATE_ITEM,
  UPDATE_ITEM,
  SET_PRODUCTS,
} from "../actions/Products";

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((pro) => pro.ownerId === "u1"),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.products.filter((pro) => pro.ownerId === "u1"),
      };
    case CREATE_ITEM:
      const newItem = new Product(
        action.productData.id,
        "U1",
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newItem),
        userProducts: state.userProducts.concat(newItem),
      };
    case UPDATE_ITEM:
      const ProductuserIndex = state.userProducts.findIndex(
        (product) => product.id === action.pid
      );
      const updateduseProduct = new Product(
        action.pid,
        state.userProducts[ProductuserIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[ProductuserIndex].price
      );
      const updatedUserProduct = [...state.userProducts];
      updatedUserProduct[ProductuserIndex] = updateduseProduct;
      const ProductAvilIndex = state.availableProducts.findIndex(
        (product) => product.id === action.pid
      );
      const updatedavaProduct = new Product(
        action.pid,
        state.availableProducts[ProductAvilIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.availableProducts[ProductAvilIndex].price
      );
      const updatedavailProduct = [...state.availableProducts];
      updatedavailProduct[ProductAvilIndex] = updatedavaProduct;
      return {
        ...state,
        availableProducts: updatedavailProduct,
        userProducts: updatedUserProduct,
      };
    case DELETE_ITEM:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.pid
        ),
      };
  }
  return state;
};
