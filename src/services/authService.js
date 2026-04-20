import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { createUserWithEmailAndPassword, signInWithCredential, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { updateDoc } from "firebase/firestore";
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export const registerWithEmail = async (name, email, password, profileData) => {
    const { user } =  await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, {displayName: name});
    await setDoc(doc(db, 'users', user.uid), {
        ...profileData,
        createdAt: Date.now(),
    });
    return user;
};

export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = async (idToken) => {
    const credential = GoogleAuthProvider.credential(idToken);
    const { user } = await signInWithCredential(auth, credential);
    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName,
      email: user.email,
      createdAt: Date.now(),
    }, { merge: true });
    return user;
  };

export const logout = () => signOut(auth);

export const updateUserProfile = (uid, data) => 
    updateDoc(doc(db, 'users', uid), data);
