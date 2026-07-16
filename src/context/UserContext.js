import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase";

export const UserContext = createContext();

export const UserProvider = ({ firebaseUser, children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (!firebaseUser) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const userRef = doc(db, "users", firebaseUser.uid);
    const unsubscribeSnap = onSnapshot(userRef, (docSnap) => {
      setProfile(docSnap.exists() ? docSnap.data() : null);
      setLoading(false);
    });
    return () => unsubscribeSnap();
  }, [firebaseUser]);

  return (
    <UserContext.Provider value={{ profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
