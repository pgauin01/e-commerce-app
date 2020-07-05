export const DELETE_ITEM = "DELETE_ITEM";
export const CREATE_ITEM = "CREATE_ITEM";
export const UPDATE_ITEM = "UPDATE_ITEM";
export const SET_PRODUCTS = "SET_PRODUCTS";
import Products from "../../modals/Products";

export const deleteItem = (productId) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://e-commerce-app-b62a8.firebaseio.com/products/${productId}.json`,
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
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://e-commerce-app-b62a8.firebaseio.com/products.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await response.json();
      // console.log(resData);
      const updatedProducts = [];
      for (let key in resData) {
        updatedProducts.push(
          new Products(
            key,
            "u1",
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }
      dispatch({ type: SET_PRODUCTS, products: updatedProducts });
    } catch (err) {
      throw err;
    }
  };
};

export const createItem = (title, imageUrl, price, description) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://e-commerce-app-b62a8.firebaseio.com/products.json",
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
      },
    });
  };
};

export const updateItem = (pid, title, imageUrl, description) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://e-commerce-app-b62a8.firebaseio.com/products/${pid}.json`,
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
