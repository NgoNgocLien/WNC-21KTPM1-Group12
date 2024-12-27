importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBeHcl9_WZrIUCOV0IaFqar8ZZbJN_vK9w",
  authDomain: "internetbanking-wnc.firebaseapp.com",
  projectId: "internetbanking-wnc",
  storageBucket: "internetbanking-wnc.firebasestorage.app",
  messagingSenderId: "13820709750",
  appId: "1:13820709750:web:3d6a5b19caedecd3ca4857",
  measurementId: "G-1VG8ZDQ9K5"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
});