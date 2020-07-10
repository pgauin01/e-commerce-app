export const DELETE_ITEM = "DELETE_ITEM";
export const CREATE_ITEM = "CREATE_ITEM";
export const UPDATE_ITEM = "UPDATE_ITEM";
export const SET_PRODUCTS = "SET_PRODUCTS";
import Products from "../../modals/Products";

export const deleteItem = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://e-commerce-app-b62a8.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong!!");
    }
    dispatch({ type: DELETE_ITEM, pid: productId });
  };
};

export const setProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    try {
      const response = await fetch(
        "https://e-commerce-app-b62a8.firebaseio.com/products.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await response.json();
      const updatedProducts = [];
      for (let key in resData) {
        updatedProducts.push(
          new Products(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }
      dispatch({
        type: SET_PRODUCTS,
        products: updatedProducts,
        userProducts: updatedProducts.filter((pro) => pro.ownerId === userId),
      });
    } catch (err) {
      throw err;
    }
  };
};

export const createItem = (title, imageUrl, price, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const response = await fetch(
      `https://e-commerce-app-b62a8.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          imageUrl,
          price,
          description,
          ownerId: userId,
        }),
      }
    );
    const resData = await response.json();
    dispatch({
      type: CREATE_ITEM,
      productData: {
        id: resData.name,
        title,
        imageUrl,
        price,
        description,
        ownerId: userId,
      },
    });
  };
};

export const updateItem = (pid, title, imageUrl, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://e-commerce-app-b62a8.firebaseio.com/products/${pid}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong!!");
    }
    dispatch({
      type: UPDATE_ITEM,
      pid: pid,
      productData: {
        title,
        imageUrl,
        description,
      },
    });
  };
};
