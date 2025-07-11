import{
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import { auth } from "./firebaseConfig";



export const registerUser = (email:string, password:string) => 
    createUserWithEmailAndPassword(auth, email, password);

export const  loginUser = (email:string, password:string) =>
    signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle =  async() => {
    const provider = new GoogleAuthProvider();
    try{
        const result = await signInWithPopup(auth,provider);
        const user = result.user;
        return{
            uid: user.uid,
            email: user.email,
          name: user.displayName,
            photo: user.photoURL,
        };
        }catch (error) {
        console.error("Google login error:", error);
        throw new Error("Failed to login with Google");

    }
}

export const resetPassword = async (email: string) => {
    try{
        await sendPasswordResetEmail(auth, email);
        return "Email sent! Please check your inbox.";
    } catch(error:any){
        console.error("Password reset error:", error);
        throw new Error(error.message || "Failed to reset password");
    }
}

export const logoutUser = () => signOut(auth);