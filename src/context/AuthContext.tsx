import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig"; // Actualizează calea

type UserRole = "admin" | "user";

interface UserData {
  role?: UserRole;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser);
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Ascultăm pentru modificări în documentul user
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data() as UserData;
            console.log("User data updated:", data);
            setUserData(data);
          } else {
            console.log("No user data found");
            setUserData(null);
          }
          setLoading(false);
        });

        return () => unsubscribeFirestore();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const isAdmin = userData?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, userData, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};