export const ORDER = "ORDER";
export const FETCH_ORDERS = "FETCH_ORDERS";
import Order from "../../modals/order";

export const fetchOrders = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://e-commerce-app-b62a8.firebaseio.com/orders/u1.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await response.json();
      const loadedOrders = [];
      for (key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }
      dispatch({ type: FETCH_ORDERS, orders: loadedOrders });
    } catch (err) {
      throw err;
    }
  };
};

export const order = (cartItems, totalAmount) => {
  return async (dispatch) => {
    const date = new Date();
    const response = await fetch(
      "https://e-commerce-app-b62a8.firebaseio.com/orders/u1.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const resData = await response.json();
    dispatch({
      type: ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date: date,
      },
    });
  };
};
