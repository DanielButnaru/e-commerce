import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

//  Login cu sesiune controlabilă
export const loginUser = async (
  email: string,
  password: string,
  rememberMe: boolean = true
) => {
  const persistence = rememberMe
    ? browserLocalPersistence
    : browserSessionPersistence;

  await setPersistence(auth, persistence);
  return signInWithEmailAndPassword(auth, email, password);
};

// Login cu Google
export const loginWithGoogle = async (rememberMe: boolean = true) => {
  const persistence = rememberMe
    ? browserLocalPersistence
    : browserSessionPersistence;

  await setPersistence(auth, persistence);

  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

//  Alte funcții
export const registerUser = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

export const logoutUser = () => signOut(auth);

//  Verificare sesiune activă
export const checkSession = (): Promise<null | { uid: string; email: string | null }> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) resolve({ uid: user.uid, email: user.email });
      else resolve(null);
    });
  });
};
