// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    GithubAuthProvider,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc 
} from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENTS_ID
};

// Initialize Firebase (Singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics (Only in the browser)
const analytics = typeof window !== "undefined"
    ? isSupported().then(yes => yes ? getAnalytics(app) : null)
    : null;

// Initialize Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Helper function for Google login
const googleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Create/update user in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLoginAt: new Date()
            });
        } else {
            await updateDoc(userRef, {
                lastLoginAt: new Date(),
                updatedAt: new Date()
            });
        }

        return user;
    } catch (error) {
        console.error("Google login error:", error);
        throw error;
    }
};

// Helper function for GitHub login
const githubLogin = async () => {
    try {
        const result = await signInWithPopup(auth, githubProvider);
        const user = result.user;

        // Create/update user in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLoginAt: new Date()
            });
        } else {
            await updateDoc(userRef, {
                lastLoginAt: new Date(),
                updatedAt: new Date()
            });
        }

        return user;
    } catch (error) {
        console.error("GitHub login error:", error);
        throw error;
    }
};

// Helper function to check if user is logged in
const checkAuth = () => {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });
    });
};

// Helper function to get current user data
const getCurrentUser = async () => {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return {
                uid: user.uid,
                ...userDoc.data()
            };
        }
        return null;
    } catch (error) {
        console.error("Error getting user data:", error);
        return null;
    }
};

// Helper function to log out
const logout = async () => {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.error("Logout error:", error);
        return false;
    }
};

export {
    app,
    auth,
    db,
    analytics,
    googleProvider,
    githubProvider,
    googleLogin,
    githubLogin,
    checkAuth,
    getCurrentUser,
    logout
};