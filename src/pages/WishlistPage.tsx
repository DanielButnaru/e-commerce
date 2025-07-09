import { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase/firebaseConfig"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import {
  fetchWishlistFromFirestore,
  syncRemoveProductFromFirestore,
} from "../firebase/wishlistService"
import {
  setWishlist,
  removeFromWishlist,
} from "../store/slice/wishlistSlice"
import { Button } from "../components/ui/button"
import type { Product } from "../types/product"
import  toast  from "react-hot-toast"


export default function WishlistPage() {
  const [user] = useAuthState(auth)
  const dispatch = useAppDispatch()
  const wishlist = useAppSelector(state => state.wishlist.items)

  useEffect(() => {
    if (user?.uid) {
      fetchWishlistFromFirestore(user.uid).then(products => {
        dispatch(setWishlist(products))
      })
    }
  }, [user, dispatch])

  const handleRemove = (id: string) => {
    if (!user?.uid) return
    dispatch(removeFromWishlist(id))
    syncRemoveProductFromFirestore(user.uid, id).catch(console.error)
    toast("Produsul a fost Șters din wishlist.")
  }

  if (!user) {
    return <p>Trebuie să fii autentificat pentru wishlist.</p>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Wishlist-ul tău</h1>
      {wishlist.length === 0 ? (
        <p>Nu ai produse în wishlist.</p>
      ) : (
        <ul className="space-y-4">
          {wishlist.map(product => (
            <li
              key={product.id}
              className="flex justify-between items-center border p-4 rounded"
            >
              <span>{product.name}</span>
              <Button variant="default" onClick={() => handleRemove(product.id)}>
                Șterge
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
