# 💡 Smart Switch

A modern IoT-based Smart Home Automation system that allows users to remotely control home appliances through a mobile application. The project consists of a React Native (Expo) mobile app, an ESP32-based controller, and Firebase Realtime Database for real-time communication.

<img width="1136" height="724" alt="Banner" src="https://github.com/user-attachments/assets/de5e1c8f-4821-4846-ade8-a8d02fdab9c1" />

---

## 📱 Features

- 🔌 Control up to 8 electrical appliances remotely
- 📶 Wi-Fi based ESP32 controller
- ⚡ Real-time device state synchronization
- 🏠 Configure controller and home Wi-Fi directly from the app
- 📍 Assign custom device names and locations
- 💡 Device type selection (Light, Fan, Socket)
- 📊 Live controller status monitoring
- 🌐 Internet connectivity detection
- 🔄 Automatic controller heartbeat
- 🔐 Firebase Realtime Database integration
- 📱 Modern Material-inspired UI
- 🎨 Custom animated splash screen
- ⚙️ Factory reset support

---

## 🛠️ Tech Stack

### Mobile App

- React Native
- Expo
- Expo Router
- TypeScript
- Firebase Realtime Database
- React Native Reanimated
- @gorhom/bottom-sheet
- React Native Gesture Handler
- React Native Toast Message
- NetInfo

### Hardware

- ESP32
- 8 Channel Relay Module

### Backend

- Firebase Realtime Database

---

## 📂 Project Structure

```
smart-switch/
│
├── app/
├── components/
├── constants/
├── hooks/
├── services/
├── assets/
├── types/
├── extra/
│   └── ESP32 Firmware Code
├── app.json
├── eas.json
└── README.md
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/roxton75/Smart-Switch-.git

cd Smart-Switch
```

### Install dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file.

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_DATABASE_URL=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

---

## ▶️ Run the Project

```bash
npx expo start
```

Android

```bash
npx expo run:android
```

---

## 📦 Build APK

Development Build

```bash
eas build --platform android --profile development
```

Production Build

```bash
eas build --platform android --profile production
```

---

## 🔧 ESP32 Firmware

The firmware provides:

- Wi-Fi provisioning
- Local HTTP server
- Controller registration
- Relay state synchronization
- Heartbeat updates
- Factory Reset
- Preferences storage
- Automatic reconnection

---

## 🔐 Security

Firebase credentials are managed using Expo Environment Variables.
Sensitive configuration files are excluded from version control.

---

## 📌 Future Improvements

- OTA Firmware Updates
- Multiple Controller Support
- Room Management
- User Authentication
- Device Sharing
- Scheduling & Automation
- Energy Consumption Monitoring
- Voice Assistant Integration
- MQTT Support

---

## 👨‍💻 Author

**Rudraksh Ramekar**

React Native Developer • Product Design and UX Enthusiast

GitHub: https://github.com/roxton75

---

## 📄 License

This project is licensed under the MIT License.
