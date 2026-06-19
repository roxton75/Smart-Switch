// import { onValue, ref } from "firebase/database";

// import { db } from "./firebase";

// export const subscribeToController = (callback: (controller: any) => void) => {
//   const controllerRef = ref(db, "controllers/controller_1");

//   return onValue(controllerRef, (snapshot) => {
//     callback(snapshot.val());
//   });
// };

import { onValue, ref } from "firebase/database";
import { db } from "./firebase";

export const subscribeToController = (callback: (controller: any) => void) => {
  const controllerRef = ref(db, "controllers/controller_1");

  return onValue(controllerRef, (snapshot) => {
    callback(snapshot.val());
  });
};