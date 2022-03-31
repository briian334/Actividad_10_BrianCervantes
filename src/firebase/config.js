import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjBKBFyLjhXnVP6aedAQaiGdtaehCCmu4",
  authDomain: "actividad-10-briancervantes.firebaseapp.com",
  databaseURL: "https://actividad-10-briancervantes-default-rtdb.firebaseio.com",
  projectId: "actividad-10-briancervantes",
  storageBucket: "actividad-10-briancervantes.appspot.com",
  messagingSenderId: "90970953542",
  appId: "1:90970953542:web:d9b9dadcb582cdc857f747"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
