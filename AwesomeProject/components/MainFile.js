import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import { authStateChangeUser } from "../redux/auth/authOperations";
import { useRoute } from "../router";

export const MainFile = () => {
  const { stateChange } = useSelector((state) => state.auth);
  console.log({ stateChange });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, [dispatch]);
  const routing = useRoute(stateChange);

  return <NavigationContainer>{routing}</NavigationContainer>;
};