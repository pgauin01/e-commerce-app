export const ADD_TO_CART = "ADD_TO_CART";
export const DELETE_CART = "DELETE_CART";
export const OFFER = "OFFER";

export const addToCart = (product) => {
  return { type: ADD_TO_CART, product: product };
};

export const deleteCart = (prodId) => {
  return { type: DELETE_CART, productId: prodId };
};

export const offer = (inputData) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://e-commerce-app-b62a8.firebaseio.com/Offers.json`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await response.json();
      // console.log(resData);
      dispatch({
        type: OFFER,
        offerData: {
          offer: resData.coupon.toUpperCase(),
          percentage: resData.percentage,
        },
        inputdata: inputData.toUpperCase(),
      });
    } catch (err) {
      throw err;
    }
  };
};
