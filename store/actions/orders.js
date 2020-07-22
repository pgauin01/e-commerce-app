export const ORDER = "ORDER";
export const FETCH_ORDERS = "FETCH_ORDERS";
import Order from "../../modals/order";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const isAdmin = getState().admin.isAdmin;
    console.log(isAdmin);

    if (isAdmin) {
      try {
        const response = await fetch(
          `https://e-commerce-app-b62a8.firebaseio.com/orders/.json`
        );
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const resData = await response.json();
        console.log(resData);
        const loadedOrders = [];
        for (const key in resData) {
          for (const newkey in resData[key]) {
            loadedOrders.push(
              new Order(
                newkey,
                resData[key][newkey].cartItems,
                resData[key][newkey].totalAmount,
                new Date(resData[key][newkey].date),
                resData[key][newkey].address
              )
            );
          }
        }
        dispatch({ type: FETCH_ORDERS, orders: loadedOrders });
        // console.log(`loaded${loadedOrders[3].total}`);
      } catch (err) {
        throw err;
      }
    } else {
      try {
        const response = await fetch(
          `https://e-commerce-app-b62a8.firebaseio.com/orders/${userId}.json`
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
              new Date(resData[key].date),
              resData[key].address
            )
          );
        }

        dispatch({ type: FETCH_ORDERS, orders: loadedOrders });
      } catch (err) {
        throw err;
      }
    }
  };
};

export const order = (cartItems, totalAmount, address) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const date = new Date();
    const response = await fetch(
      `https://e-commerce-app-b62a8.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          address,
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
        address: address,
      },
    });
  };
};
