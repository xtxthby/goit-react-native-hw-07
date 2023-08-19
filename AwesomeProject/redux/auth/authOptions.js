import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { updateUserProfile, authStateChange, authSignOut } from "./authSlice";
import { auth } from "../../firebase/config";

export const authSignUp =
  ({ login, email, password }) =>
  async (dispatch, getState) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: login,
      });

      const { displayName, uid } = await auth.currentUser;
      dispatch(updateUserProfile({ userId: uid, login: displayName, email }));
    } catch (error) {
      console.log(error);
    }
  };

export const loginDB =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  try {
    signOut(auth);
    dispatch(authSignOut());
  } catch (error) {
    console.log(error);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  try {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email } = user;

        dispatch(
          updateUserProfile({
            userId: uid,
            login: displayName,
            email: email,
          })
        );
        dispatch(authStateChange({ stateChange: true }));
      }
    });
  } catch (error) {
    console.log(error);
  }
};