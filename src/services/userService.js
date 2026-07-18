import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

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
