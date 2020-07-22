import { ORDER } from "../actions/orders";
import Order from "../../modals/order";
import { FETCH_ORDERS } from "../actions/orders";

const initialState = {
  orders: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERS:
      return {
        orders: action.orders,
      };
    case ORDER:
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date,
        action.orderData.address
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder),
      };
  }
  return state;
};
