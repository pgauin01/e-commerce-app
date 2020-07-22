export const FETCH_ADDRESS = "FETCH_ADDRESS";
export const ADD_ADDRESS = "ADD_ADDRESS";
export const UPDATE_ADDRESS = "UPDATE_ADDRESS";
export const DELETE_ADDRESS = "DELETE_ADDRESS";
import Adress from "../../modals/address";

export const fetchAddress = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://e-commerce-app-b62a8.firebaseio.com/address/${userId}.json`
      );
      if (!response.ok) {
        throw new Error("Something went wrong in fetchAddrees");
      }
      const resData = await response.json();
      console.log(resData);
      const loadedAddress = [];
      for (const key in resData) {
        loadedAddress.push(
          new Adress(
            key,
            resData[key].name,
            resData[key].street,
            resData[key].building,
            resData[key].landmark,
            resData[key].state,
            resData[key].mobile,
            resData[key].locationType
          )
        );
      }
      dispatch({
        type: FETCH_ADDRESS,
        address: loadedAddress,
        useraddress: loadedAddress,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const addAddress = (
  name,
  street,
  building,
  landmark,
  state,
  mobile,
  locationType
) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;

    try {
      const response = await fetch(
        `https://e-commerce-app-b62a8.firebaseio.com/address/${userId}.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            street,
            building,
            landmark,
            state,
            mobile,
            locationType,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Something went Wrong in Addaddress");
      }
      const resData = await response.json();
      dispatch({
        type: ADD_ADDRESS,
        addressData: {
          id: resData.name,
          name,
          street,
          building,
          landmark,
          state,
          mobile,
          locationType,
        },
      });
      dispatch;
    } catch (err) {
      throw err;
    }
  };
};

export const updateAddress = (
  id,
  name,
  street,
  building,
  landmark,
  state,
  mobile,
  locationType
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    try {
      const response = await fetch(
        `https://e-commerce-app-b62a8.firebaseio.com/address/${userId}/${id}.json?auth=${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            street,
            building,
            landmark,
            state,
            mobile,
            locationType,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Something went Wrong in updateAddress");
      }
      const resData = await response.json();
      dispatch({
        type: UPDATE_ADDRESS,
        addressData: {
          id,
          name,
          street,
          building,
          landmark,
          state,
          mobile,
          locationType,
        },
      });
      dispatch;
    } catch (err) {
      throw err;
    }
  };
};

export const deleteAddress = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    try {
      const response = await fetch(
        `https://e-commerce-app-b62a8.firebaseio.com/address/${userId}/${id}.json?auth=${token}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong in deleteAddress!!");
      }
      dispatch({ type: DELETE_ADDRESS, id: id });
    } catch (err) {
      throw err;
    }
  };
};
