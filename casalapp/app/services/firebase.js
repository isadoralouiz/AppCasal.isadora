import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyB2BC3oqDExqxWHztAqfoX3yxx0RQlhYBc",
  authDomain: "casalapp-d567a.firebaseapp.com",
  projectId: "casalapp-d567a",
  storageBucket: "casalapp-d567a.firebasestorage.app",
  messagingSenderId: "1095791411771",
  appId: "1:1095791411771:web:29489df8998b8c5442121e",
  measurementId: "G-KQ7DSN490B"
};

const app = initializeApp(firebaseConfig);

// Configura Firebase Auth com persistência AsyncStorage para React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);


export { auth, db };