import ADDRESS from "../../data/dummy-address";
import Adress from "../../modals/address";
import {
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  FETCH_ADDRESS,
} from "../actions/Address";

const initialState = {
  address: [],
  useraddress: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADDRESS:
      return {
        address: action.address,
        useraddress: action.useraddress,
      };
    case ADD_ADDRESS:
      const newAddress = new Adress(
        action.addressData.id,
        action.addressData.name,
        action.addressData.street,
        action.addressData.building,
        action.addressData.landmark,
        action.addressData.state,
        action.addressData.mobile,
        action.addressData.locationType
      );
      return {
        address: state.address.concat(newAddress),
        useraddress: state.useraddress.concat(newAddress),
      };
    case UPDATE_ADDRESS:
      const UpdatedAddressIndex = state.address.findIndex(
        (addres) => addres.id === action.addressData.id
      );
      const UpdatedUserAddressIndex = state.useraddress.findIndex(
        (addres) => addres.id === action.addressData.id
      );
      const updateAdd = new Adress(
        action.addressData.id,
        action.addressData.name,
        action.addressData.street,
        action.addressData.building,
        action.addressData.landmark,
        action.addressData.state,
        action.addressData.mobile,
        action.addressData.locationType
      );
      const UpdatedAddress = [...state.address];
      UpdatedAddress[UpdatedAddressIndex] = updateAdd;
      const UpdateduserAddress = [...state.useraddress];
      UpdateduserAddress[UpdatedUserAddressIndex] = updateAdd;
      return {
        address: UpdatedAddress,
        useraddress: UpdateduserAddress,
      };
    case DELETE_ADDRESS:
      return {
        address: state.address.filter((el) => el.id !== action.id),
        useraddress: state.useraddress.filter((el) => el.id !== action.id),
      };

    default:
      return state;
  }
};
