import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

export const registerWithEmail = async (name, email, password, profileData) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  await setDoc(doc(db, "users", user.uid), {
    ...profileData,
    name,
    createdAt: Date.now(),
  });
  return user;
};

/**
 * Writes the full profile document for an already-created Firebase Auth user.
 * Does NOT create the auth account — that already happened in RegisterScreen
 * via createUserWithEmailAndPassword. This just attaches profile data to it.
 */
export async function saveUserProfile(uid, profileData) {
  if (!uid) {
    throw new Error(
      "Missing uid — cannot save profile without an authenticated user.",
    );
  }
  await setDoc(doc(db, "users", uid), {
    ...profileData,
    createdAt: new Date().toISOString(),
  });
  return uid;
}

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const useGoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type !== "success") return;

      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      const { user } = await signInWithCredential(auth, credential);

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName,
          email: user.email,
          createdAt: Date.now(),
        },
        { merge: true },
      );
    };

    handleGoogleResponse();
  }, [response]);

  console.log(request?.url);

  return { request, response, promptAsync };
};

export const logout = () => signOut(auth);

export const updateUserProfile = (uid, data) =>
  updateDoc(doc(db, "users", uid), data);
