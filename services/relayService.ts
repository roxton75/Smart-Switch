import { onValue, ref, update } from "firebase/database";

import { db } from "./firebase";

export const subscribeToDevices = (callback: (devices: any[]) => void) => {
  const relaysRef = ref(db, "controllers/controller_1/relays");

  return onValue(relaysRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      callback([]);
      return;
    }

    const devices = Object.entries(data)
      .map(([relayId, relay]: any) => ({
        relayId,
        ...relay,
      }))
      .filter((device: any) => device.assigned);

    callback(devices);
  });
};

export const toggleRelayState = async (
  relayId: string,
  currentState: boolean,
) => {
  const relayRef = ref(db, `controllers/controller_1/relays/${relayId}`);

  await update(relayRef, {
    state: !currentState,
  });
};

export const removeRelay = async (relayId: string) => {
  const relayRef = ref(db, `controllers/controller_1/relays/${relayId}`);

  await update(relayRef, {
    assigned: false,
    name: "",
    location: "",
    type: "",
    state: false,
  });
};

export const updateRelay = async (
  relayId: string,
  data: {
    name: string;
    location: string;
    type: string;
  },
) => {
  const relayRef = ref(db, `controllers/controller_1/relays/${relayId}`);

  await update(relayRef, {
    name: data.name,
    location: data.location,
    type: data.type,
  });
};

export const configureRelay = async (
  relayId: string,
  data: {
    name: string;
    location: string;
    type: string;
  },
) => {
  const relayRef = ref(db, `controllers/controller_1/relays/${relayId}`);

  await update(relayRef, {
    assigned: true,
    name: data.name,
    location: data.location,
    type: data.type,
    state: false,
  });
};