import { IS_ADMIN, LOG_OUT } from "../actions/Admin";
const initialState = {
  isAdmin: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_ADMIN:
      if (action.adminData.initailUid === action.adminData.fetchedUid) {
        return {
          isAdmin: true,
        };
      }
    case LOG_OUT:
      return {
        isAdmin: false,
      };

    default:
      return state;
  }
};
