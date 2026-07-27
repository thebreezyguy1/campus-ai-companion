import { doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "./firebase";
import { Alert } from "react-native";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const updateCompletedCourses = async (completedCourses) => {
  const user = auth.currentUser;
  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { completedCourses });
  } catch (error) {
    console.error("Unable to update user info:", error);
    throw error;
  }
};

export const uploadProfileImage = async (localUri) => {
  const user = auth.currentUser;
  try {
    const response = await fetch(localUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `profilePhotos/${user.uid}.jpg`);
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (err) {
    throw new Error(err.message ?? "Photo upload failed. Please try again.");
  }
};

export const updateProfile = async (profile) => {
  const user = auth.currentUser;
  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, profile);
  } catch (error) {
    console.error("Unable to update user info:", error);
    throw error;
  }
};
