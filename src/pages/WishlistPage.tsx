import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchWishlistFromFirestore,
  syncRemoveProductFromFirestore,
} from "../firebase/wishlistService";
import { setWishlist, removeFromWishlist } from "../store/slice/wishlistSlice";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const [user] = useAuthState(auth);
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.items);

  useEffect(() => {
    if (user?.uid) {
      fetchWishlistFromFirestore(user.uid).then((products) => {
        dispatch(setWishlist(products));
      });
    }
  }, [user, dispatch]);

  const handleRemove = (id: string) => {
    if (!user?.uid) return;
    dispatch(removeFromWishlist(id));
    syncRemoveProductFromFirestore(user.uid, id).catch(console.error);
    toast("Produsul a fost Șters din wishlist.");
  };

  if (!user) {
    return <p>Trebuie să fii autentificat pentru wishlist.</p>;
  }

  return (
    <div className="w-full h-full pt-20">
      <div className="flex flex-col items-center justify-between p-4 max-w-3xl mx-auto border shadow-2xl ">
        <h1 className="text-2xl font-bold mb-4">Wishlist-ul tău</h1>
        {wishlist.length === 0 ? (
          <p>Nu ai produse în wishlist.</p>
        ) : (
          <div className="space-y-4 w-full">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center border-b p-4 rounded w-full"
              >
                <div className="flex flex-row space-x-4">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{product.name}</h4>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => handleRemove(product.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
