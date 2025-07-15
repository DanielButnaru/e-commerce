// src/firebase/wishlistService.ts
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "./firebaseConfig"
import type { Product } from "../types/product"

// Preia wishlist-ul unui user
export async function fetchWishlistFromFirestore(userId: string): Promise<Product[]> {
  const docRef = doc(db, "users", userId)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    // Dacă nu există încă, returnăm un array gol
    return []
  }

  const data = docSnap.data()
  return data.wishlist || []
}

// Adaugă un produs în wishlist-ul Firestore
export async function syncAddProductToFirestore(userId: string, product: Product) {
  const docRef = doc(db, "users", userId)
  await updateDoc(docRef, {
    wishlist: arrayUnion(product)
  }).catch(async (err) => {
    if (err.code === 'not-found') {
      // Dacă doc nu există, îl creăm cu produsul în wishlist
      await setDoc(docRef, { wishlist: [product] })
    } else {
      throw err
    }
  })
}

// Șterge un produs din wishlist-ul Firestore
export async function syncRemoveProductFromFirestore(userId: string, productId: string) {
  const docRef = doc(db, "users", userId)

  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) return

  const data = docSnap.data()
  const wishlist: Product[] = data.wishlist || []

  const updatedWishlist = wishlist.filter(item => item.id !== productId)
  await updateDoc(docRef, { wishlist: updatedWishlist })
}
