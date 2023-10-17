import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { getFirestore, collection, where, getDocs, getDoc, updateDoc, doc, query, limit, setDoc, orderBy, startAt } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getStorage } from "firebase/storage";

import { daysBetween } from "./helpers";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-KIBtmZih6P2swX7wKGL01UJUysTLw3M",
    authDomain: "daily-writer.firebaseapp.com",
    projectId: "daily-writer",
    storageBucket: "daily-writer.appspot.com",
    messagingSenderId: "30535688818",
    appId: "1:30535688818:web:fced6302f08c15f86fd8eb",
    measurementId: "G-1R9ZE3VSWM"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

// Initialisation can only happen once, this stop re-firing
function createFirebaseApp(config) {
    try {
      return getApp();
    } catch {
      return initializeApp(config);
    }
}

const firebaseApp = createFirebaseApp(firebaseConfig);
export { firebaseApp, getAnalytics, logEvent };

// Auth exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
export const firestore = getFirestore(firebaseApp);

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';

export const getUserFromId = async (id) => {
    try {
        const userDoc = doc(firestore, "users", id);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            return data
        } else {
            console.log(`No user found with id: ${id}`);
            return null;
        };
    } catch (e) {
        console.log(e);
    };
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log("User signed out successfully");
    } catch (error) {
        console.error("Error signing out:", error);
    }
}

export const getStint = async (userId, stintId) => {
    try {
        const userDoc = doc(firestore, "users", userId, "stints", stintId);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            return { id: userSnapshot.id, ...data };
        } else {
            console.log(`No user found with user id: ${userId} and doc id: ${stintId}`);
            return null;
        };
    } catch (e) {
        console.log(e);
        return null;
    };
};

export const getNumberOfDays = async (userId, stintId) => {
    try {
        const userDoc = doc(firestore, "users", userId, "stints", stintId);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            return data.numberOfDays;
        } else {
            console.log(`No user found with user id: ${userId} and doc id: ${stintId}`);
            return null;
        };
    } catch (e) {
        console.log(e);
        return null;
    };
};

export const getStartDate = async (userId, stintId) => {
    try {
        const userDoc = doc(firestore, "users", userId, "stints", stintId);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            return data.startDate;
        } else {
            console.log(`No user found with user id: ${userId} and doc id: ${stintId}`);
            return null;
        };
    } catch (e) {
        console.log(e);
        return null;
    };
};

export const getEntry = async (userId, stintId, day) => {
    try {
        const userDoc = doc(firestore, "users", userId, "stints", stintId);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            const entries = data.entries;
            return entries[day - 1];
        } else {
            console.log(`No user found with user id: ${userId} and doc id: ${stintId}`);
            return null;
        };
    } catch (e) {
        console.log(e);
        return null;
    };
};

export const updateSingleEntry = async (userId, stintId, day, newValue) => {
    const docRef = doc(firestore, "users", userId, "stints", stintId);
  
    // 1. Read the document.
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
  
      if (data && Array.isArray(data.entries)) {
        // 2. Modify the array in your application.
        data.entries[day - 1] = newValue;
  
        // 3. Write the modified array back to the document.
        await updateDoc(docRef, { entries: data.entries });
      } else {
        console.error("Entries field is not an array or document does not exist.");
      }
    } else {
      console.error("Document not found.");
    }
}

export const updateRecentEntries = async (userId, stintId, day) => {

    // maximum number of recent entries
    const maxEntries = 3;

    // get the user's data
    const docRef = doc(firestore, "users", userId);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
        
      if (data && data.recentEntries) {

        // remove the entry if it is already in the array
        let index = data.recentEntries.indexOf(`${stintId}/${day}`);
        if (index !== -1) {
            data.recentEntries.splice(index, 1);
        }
            
        // if already at max number of entries
        if (data.recentEntries.length >= maxEntries) {

            // remove oldest entry (start of array)
            data.recentEntries.shift();
        }

        // add new entry to end of the list
        data.recentEntries.push(`${stintId}/${day}`)
  
        // 3. Write the modified array back to the document.
        await updateDoc(docRef, { recentEntries: data.recentEntries });
      } else {
        console.error("Entries field is not an array or document does not exist.");
      }
    } else {
      console.error("Document not found.");
    }
}

export const getUserStints = async (id) => {
    const spansCollection = collection(firestore, "users", id, "stints");
    const querySnapshot = await getDocs(spansCollection);
    
    const stints = [];

    querySnapshot.forEach((doc) => {
        stints.push({
            id: doc.id,
            ...doc.data()
        });
    });

    return stints.length > 0 ? stints : [];
};

export const createStint = async (userId, docId, title, startDate, endDate) => {

    const startDateObj = new Date(startDate + "T00:00:00Z"); // Appending "T00:00:00Z" to ensure it's treated as UTC
    const endDateObj = new Date(endDate + "T00:00:00Z"); 

    const numberOfDays = daysBetween(startDateObj, endDateObj);
    const entries = Array(numberOfDays).fill('');

    const docData = {
        title: title,
        startDate: Timestamp.fromDate(startDateObj),
        endDate: Timestamp.fromDate(endDateObj),
        numberOfDays: numberOfDays,
        entries: entries
    };

    console.log("doc data ipae")

    await setDoc(doc(firestore, "users", userId, "stints", docId), docData);
};