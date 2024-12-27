import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBeHcl9_WZrIUCOV0IaFqar8ZZbJN_vK9w",
  authDomain: "internetbanking-wnc.firebaseapp.com",
  projectId: "internetbanking-wnc",
  storageBucket: "internetbanking-wnc.firebasestorage.app",
  messagingSenderId: "13820709750",
  appId: "1:13820709750:web:3d6a5b19caedecd3ca4857",
  measurementId: "G-1VG8ZDQ9K5"
};

const app = initializeApp(firebaseConfig); // Initialize Firebase

const messaging = getMessaging(app); // Initialize FCM and get a reference to the service

export const requestFCMToken = async () => {
  return Notification.requestPermission()
    .then((permission) => {
      if (permission === 'granted') {
        return getToken(messaging, { vapidKey: process.env.REACT_APP_FCM_VAPID_KEY });
      } else {
        throw new Error('Notification permission granted.');
      }
    })
    .catch((err) => {
      console.log('Error getting FCM token: ', err);
      throw err;
    });
}

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
}