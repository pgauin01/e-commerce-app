import CartItem from "../../modals/cartItem";
import { ADD_TO_CART } from "../actions/Cart";
import { DELETE_CART } from "../actions/Cart";
import { ORDER } from "../actions/orders";
import { DELETE_ITEM } from "../actions/Products";
import { OFFER } from "../actions/Cart";

const initialState = {
  items: {},
  totalAmount: 0,
  validity: false,
};
// console.log(totalAmount);

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;
      let updatedorNewcartItem;
      if (state.items[addedProduct.id]) {
        updatedorNewcartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodTitle,
          prodPrice,
          state.items[addedProduct.id].total + prodPrice
        );
        return {
          ...state,
          items: { ...state.items, [addedProduct.id]: updatedorNewcartItem },
          totalAmount: state.totalAmount + prodPrice,
        };
      } else {
        updatedorNewcartItem = new CartItem(1, prodTitle, prodPrice, prodPrice);
        return {
          ...state,
          items: { ...state.items, [addedProduct.id]: updatedorNewcartItem },
          totalAmount: state.totalAmount + prodPrice,
        };
      }
    case DELETE_CART:
      const selectedProd = state.items[action.productId];
      const currentQty = selectedProd.quantity;
      let updatedCartItems;
      if (currentQty > 1) {
        const updateProd = new CartItem(
          selectedProd.quantity - 1,
          selectedProd.title,
          selectedProd.price,
          selectedProd.total - selectedProd.price
        );
        updatedCartItems = { ...state.items, [action.productId]: updateProd };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.productId];
      }

      updatedtotalAmount = state.totalAmount - selectedProd.price;

      if (updatedtotalAmount < 0) {
        updatedtotalAmount = 0;
      } else {
        updatedtotalAmount;
      }

      return {
        ...state,
        items: updatedCartItems,
        totalAmount: updatedtotalAmount,
      };
    case ORDER:
      return initialState;
    case DELETE_ITEM:
      if (!state.items[action.pid]) {
        return state;
      }
      const updatedProduct = { ...state.items };
      const prodTotal = updatedProduct[action.pid].price;
      delete updatedProduct[action.pid];
      return {
        ...state,
        items: updatedProduct,
        totalAmount: state.totalAmount - prodTotal,
      };
    case OFFER:
      const percentage = +action.offerData.percentage;
      const updatedAmount = (state.totalAmount * (100 - percentage)) / 100;
      // console.log(updatedAmount);
      if (action.inputdata === action.offerData.offer) {
        return {
          ...state,
          totalAmount: updatedAmount,
          validity: true,
        };
      }
  }
  return state;
};
