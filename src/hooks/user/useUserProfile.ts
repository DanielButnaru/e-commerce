import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import type { User } from "firebase/auth";
import type { UserProfile } from "../../firebase/user/types";

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>, user: User | null) => Promise<boolean>;
}

const useUserProfile = (user: User | null): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrCreateProfile = async () => {
      if (!user) {
        if (isMounted) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        if (!isMounted) return;

        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            name: user.displayName || "",
            email: user.email || "",
            phone: user.phoneNumber || "",
            address: {
              street: "",
              city: "",
              state: "",
              zip: "",
            },
          };
          await setDoc(userDoc, newProfile);
          setProfile(newProfile);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load or create user profile");
          console.error("Error loading or creating user profile:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrCreateProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>, currentUser: User | null): Promise<boolean> => {
    if (!currentUser) {
      const error = new Error("User not authenticated - please sign in");
      setError(error.message);
      throw error;
    }
    if (!profile) {
      const error = new Error("Profile not loaded - please try again");
      setError(error.message);
      throw error;
    }
    if (updating) {
      const error = new Error("Update already in progress");
      setError(error.message);
      throw error;
    }

    setUpdating(true);
    setError(null);

    try {
      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, data);
      setProfile((prev) => ({
        ...prev!,
        ...data,
      }));
      return true;
    } catch (err) {
      const error = new Error("Failed to update profile");
      setError(error.message);
      console.error("Error updating user profile:", err);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  return {
    profile,
    loading,
    updating,
    error,
    updateProfile,
  };
};

export { useUserProfile };
