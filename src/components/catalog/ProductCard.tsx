import type { Product } from "../../types/product";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slice/cartSlice";
import { Heart } from "lucide-react";
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
import { Link } from "react-router-dom";

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
    <div className="relative bg-white rounded-2xl shadow flex flex-col justify-between">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.thumbnail}
          alt={product.name}
          className="h-48 w-full object-cover rounded-xl mb-4"
        />
        <h3 className="text-lg px-2 font-semibold">{product.name}</h3>
      </Link>
      <div className="flex flex-col items-center justify-between mt-auto gap-2 py-4 px-2">
        <span className="text-primary text-lg font-semibold inline-flex">
          {product.price.toFixed(2)}
          <span className="text-gray-500 text-lg ml-1">$</span>
        </span>
        <Button
          size="sm"
          onClick={() => dispatch(addToCart(product))}
          className="text-white hover:scale-105 transition cursor-pointer w-full"
        >
          Add to cart
        </Button>
      </div>

      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 p-1 text-red-500 hover:scale-110 transition"
        aria-label={isWished ? "Șterge din wishlist" : "Adaugă în wishlist"}
      >
        {isWished ? <Heart fill="red" /> : <Heart />}
      </button>
    </div>
  );
}
