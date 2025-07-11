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
import OptimizedImage from "../ui/OptimizedImage";

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
      toast.error("Trebuie să fii autentificat pentru wishlist");
      return;
    }

    if (isWished) {
      dispatch(removeFromWishlist(product.id));
      syncRemoveProductFromFirestore(user.uid, product.id).catch(console.error);
      toast("Produs șters din wishlist", { icon: "🗑️" });
    } else {
      dispatch(addToWishlist(product));
      syncAddProductToFirestore(user.uid, product).catch(console.error);
      toast.success("Produs adăugat în wishlist");
    }
  };

  const handleAddToCart = () => {
    if (product.stockStatus === "out-of-stock") {
      toast.error("Produsul nu este disponibil în stoc");
      return;
    }

    if (product.stockStatus === "pre-order") {
      toast("Produs disponibil pentru precomandă", { icon: "📦" });
    }

    dispatch(addToCart(product));
    toast.success("Produs adăugat în coș");
  };

  // Calculează prețul afișat (reducere sau preț normal)
  const displayPrice =
    product.isOnSale && product.salePrice
      ? product.salePrice
      : product.basePrice;

  // Verifică disponibilitatea
  const isOutOfStock = product.stockStatus === "out-of-stock";
  const isLowStock =
    product.stockStatus === "in-stock" &&
    product.stock <= (product.lowStockThreshold || 5);



  return (
    <div
      className={`relative bg-white rounded-2xl shadow flex flex-col justify-between  ${
        isOutOfStock ? "opacity-80" : ""
      }`}
    >
      {/* Badge-uri pentru stoc */}
      {isOutOfStock && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-30">
          STOC EPUIZAT
        </div>
      )}
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
          STOC LIMITAT
        </div>
      )}
      {product.isOnSale && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          REDUCERE
        </div>
      )}

      <Link to={`/product/${product.id}`} className="group">


        <OptimizedImage
          src={product.thumbnail}
          alt={product.name}
          width={400}
          height={600}
          quality={80}
          className="h-48 w-full object-contain rounded-xl mb-4 group-hover:opacity-90 transition-opacity"
          
          priority= {true}
        />
        {/* <img
          src={product.thumbnail}
          alt={product.name}
          className="h-48 w-full object-contain rounded-xl mb-4 group-hover:opacity-90 transition-opacity"
        /> */}
        <div className="px-2">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-sm text-gray-500">{product.brand}</p>
          )}
        </div>
      </Link>

      <div className="flex flex-col items-center justify-between mt-auto gap-2 py-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-primary text-lg font-semibold">
            {displayPrice.toFixed(2)} $
          </span>
          {product.isOnSale && product.salePrice && (
            <span className="text-gray-400 text-sm line-through">
              {product.basePrice.toFixed(2)} $
            </span>
          )}
        </div>

        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`text-white hover:scale-105 transition cursor-pointer w-full ${
            isOutOfStock ? "bg-gray-400 cursor-not-allowed" : ""
          }`}
        >
          {isOutOfStock ? "Stoc epuizat" : "Adaugă în coș"}
        </Button>
      </div>

      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:scale-110 transition"
        aria-label={isWished ? "Șterge din wishlist" : "Adaugă în wishlist"}
      >
        {isWished ? (
          <Heart className="text-red-500 fill-red-500" size={20} />
        ) : (
          <Heart className="text-gray-600" size={20} />
        )}
      </button>
    </div>
  );
}
