// src/utils/getCurrentUserID.js
import { getAuth, onAuthStateChanged } from "firebase/auth";

const getCurrentUserID = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // stop listening
      if (user) {
        resolve(user.uid);
      } else {
        resolve(null); // not logged in
      }
    }, reject);
  });
};

export default getCurrentUserID;
