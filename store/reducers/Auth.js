import { AUTHENTICATE, LOGOUT } from "../actions/Auth";

const initialState = {
  token: null,
  userId: null,
  refreshToken: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
        refreshToken: action.refreshToken,
      };
    case LOGOUT:
      return initialState;
    // case LOGIN:
    //   return {
    //     token: action.token,
    //     userId: action.userId,
    //   };
    default:
      return state;
  }
};
