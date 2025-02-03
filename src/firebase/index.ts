import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
	apiKey: 'AIzaSyDW5MwWsp7IV6XylD7VdIfhCMNB8CdRQr8',
	authDomain: 'gym-app-ffa21.firebaseapp.com',
	projectId: 'gym-app-ffa21',
	storageBucket: 'gym-app-ffa21.firebasestorage.app',
	messagingSenderId: '828408439497',
	appId: '1:828408439497:web:3851fec1043da8f850a318',
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
