import { AsyncStorage } from "react-native";
// export const SIGN_UP = "SIGN_UP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
// let timer;

export const authenticate = (token, userId) => {
  return (dispatch) => {
    // dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE,
      token: token,
      userId: userId,
    });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAKt575GdMEOih-L5wNvEsHxUM75XCRK_U",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      const errorId = errorData.error.message;
      let message = "Something went wrong";
      if (errorId === "EMAIL_EXISTS") {
        message = "Email already in use";
      }

      throw new Error(message);
    }
    const resData = await response.json();

    try {
      const response = await fetch(
        `https://e-commerce-app-b62a8.firebaseio.com/Admin.json`
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await response.json();
      dispatch({
        type: IS_ADMIN,
        adminData: { initailUid: resData.localId, fetchedUid: resData.Uid },
      });
    } catch (err) {
      throw err;
    }

    dispatch(
      authenticate(
        resData.idToken,
        resData.localId,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationTime = new Date(
      new Date().getTime() + +resData.expiresIn * 1000
    );
    saveDataToStorage(
      resData.idToken,
      resData.localId,
      expirationTime,
      resData.refreshToken
    );
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAKt575GdMEOih-L5wNvEsHxUM75XCRK_U",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      const errorId = errorData.error.message;

      let message = "Something went wrong!";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid!";
      }

      throw new Error(message);
    }
    const resData = await response.json();
    // console.log(resData.refreshToken);
    dispatch(
      authenticate(
        resData.idToken,
        resData.localId,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationTime = new Date(
      new Date().getTime() + +resData.expiresIn * 1000
    );
    saveDataToStorage(
      resData.idToken,
      resData.localId,
      expirationTime,
      resData.refreshToken
    );
  };
};

export const Googlelogin = (GidToken) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=AIzaSyAKt575GdMEOih-L5wNvEsHxUM75XCRK_U",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postBody: `id_token=${GidToken}&providerId=google.com`,
          requestUri: "http://localhost",
          returnIdpCredential: true,
          returnSecureToken: true,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      const errorId = errorData.error.message;
      // console.log(errorId);
      throw new Error("Something went wrong in googleAuth");
    }

    // console.log(resData.idToken);
    // console.log(resData.localId);
    // console.log(resData.expiresIn);
    const resData = await response.json();
    dispatch(
      authenticate(
        resData.idToken,
        resData.localId,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationTime = new Date(
      new Date().getTime() + +resData.expiresIn * 1000
    );
    saveDataToStorage(
      resData.idToken,
      resData.localId,
      expirationTime,
      resData.refreshToken
    );
  };
};

export const logout = () => {
  // clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  AsyncStorage.removeItem("refreshToken");
  return { type: LOGOUT };
};

// const clearLogoutTimer = () => {
//   if (timer) {
//     clearTimeout(timer);
//   }
// };

// const setLogoutTimer = (expirationTime) => {
//   return (dispatch) => {
//     timer = setTimeout(() => {
//       dispatch(logout());
//     }, expirationTime);
//   };
// };

export const refreshData = (refreshToken) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://securetoken.googleapis.com/v1/token?key=AIzaSyAKt575GdMEOih-L5wNvEsHxUM75XCRK_U",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=refresh_token&refresh_token=" + refreshToken,
        }
      );

      if (!response.ok) {
        throw new Error("something went wrong in refresh.");
      }
      const resData = await response.json(); // transforms the data from json to javascript object
      console.log(resData);

      // NOTE!!! YOU HAVE TO USE id_token NOT idToken
      dispatch(
        authenticate(
          resData.id_token,
          resData.user_id,
          parseInt(resData.expires_in) * 1000
        )
      );
      // The first new Date converts the second's huge number of miliseconds in a concrete date.

      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expires_in) * 1000
      );

      // Use this to test it
      //const expirationDate = new Date(new Date().getTime() + 20 * 1000);

      saveDataToStorage(
        resData.id_token,
        resData.user_id,
        expirationDate,
        resData.refresh_token
      );
    } catch (error) {
      throw error;
    }
  };
};

const saveDataToStorage = (token, userId, expirationDate, refreshToken) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
  AsyncStorage.setItem("refreshToken", refreshToken);
};
