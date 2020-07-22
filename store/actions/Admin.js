export const IS_ADMIN = "IS_ADMIN";
export const LOG_OUT = "LOG_OUT";

export const isAdmin = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    try {
      const response = await fetch(
        `https://e-commerce-app-b62a8.firebaseio.com/Admin.json`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await response.json();
      dispatch({
        type: IS_ADMIN,
        adminData: { initailUid: userId, fetchedUid: resData.Uid },
      });
    } catch (err) {
      throw err;
    }
  };
};

export const adminLogout = () => {
  return { type: LOG_OUT };
};
