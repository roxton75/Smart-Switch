export interface Device {
  relayId: string;
  assigned: boolean;
  isOnline: boolean;
  location: string;
  name: string;
  state: boolean;
  type: "light" | "fan" | "socket";
}
