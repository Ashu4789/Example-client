import { SET_USER, CLEAR_USER } from "./action";

//get called everytime dispatch function is called
//Irrespective of the action type and payload.
export const userReducer = (state = null, action) => {
  switch (action.type) {
    //this action helps in setting the user data in the state when the user logs in or when we fetch the user data from the server.
    case SET_USER:
      return action.payload;
    //this case helps in logout functionality where we want to clear the user data from the state.
    case CLEAR_USER:
      return null;
    //this case helps in handling cases where useReducer is envoked due to change in some other state variable maintained by redux.
    default:
      return state;
  }
};