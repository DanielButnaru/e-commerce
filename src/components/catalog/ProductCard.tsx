import type { Product } from "../../types/product";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slice/cartSlice";
import { Heart, HeartOff } from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slice/wishlistSlice";
import {
  syncAddProductToFirestore,
  syncRemoveProductFromFirestore,
} from "../../firebase/wishlistService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const isWished = useAppSelector((state) =>
    state.wishlist.items.some((item) => item.id === product.id)
  );
  const [user] = useAuthState(auth);

  const toggleWishlist = () => {
    if (!user?.uid) {
      alert("Trebuie să fii autentificat pentru wishlist.");
      return;
    }

    if (isWished) {
      dispatch(removeFromWishlist(product.id));
      syncRemoveProductFromFirestore(user.uid, product.id).catch(console.error);
      toast("Produsul a fost Șters din wishlist.", {
        icon: "🎉",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      dispatch(addToWishlist(product));
      syncAddProductToFirestore(user.uid, product).catch(console.error);
      toast("Produsul a fost adaugat in wishlist.", {
        icon: "🎉",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover rounded-xl mb-4"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-2">{product.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-primary font-bold">
          {product.price.toFixed(2)} RON
        </span>
        <Button
          size="sm"
          onClick={() => dispatch(addToCart(product))}
          className="text-black"
        >
          Adaugă în coș
        </Button>
      </div>

      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 p-1 text-red-500 hover:scale-110 transition"
        aria-label={isWished ? "Șterge din wishlist" : "Adaugă în wishlist"}
      >
        {isWished ? <HeartOff /> : <Heart />}
      </button>
    </div>
  );
}
