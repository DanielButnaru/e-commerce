import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slice/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slice/wishlistSlice";
import { useAppSelector } from "../store/hooks";
import toast from "react-hot-toast";
import ProductCard from "../components/catalog/ProductCard";
import { useProductById } from "../hooks/products/useProductById";
import { useProductsFromFirestore } from "../hooks/products/useProductsFromFirestore";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { product, loading } = useProductById(id);
  const { products } = useProductsFromFirestore(); // pentru produse similare

  const [mainImage, setMainImage] = useState<string | undefined>(undefined);

  const isWished = useAppSelector((state) =>
    state.wishlist.items.some((item) => item.id === id)
  );

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    } else if (product?.image) {
      setMainImage(product.image);
    } else {
      setMainImage(undefined);
    }
  }, [product]);

 const similarProducts = product
  ? products.filter((p) =>
      p.id !== product.id &&
      Array.isArray(p.category) &&
      Array.isArray(product.category) &&
      p.category.some((cat) => product.category.includes(cat))
    )
  : [];

  const handleCart = () => {
    if (product) {
      dispatch(addToCart(product));
      toast.success("Adăugat în coș");
    }
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (isWished) {
      dispatch(removeFromWishlist(product.id));
      toast("Eliminat din wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Adăugat la wishlist");
    }
  };

  if (loading) return <p className="p-6">Se încarcă produsul...</p>;
  if (!product) return <p className="p-6">Produsul nu a fost găsit.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10 mb-10">
        {/* Imagine produs */}
        <div>
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl mb-4"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
              Imagine indisponibilă
            </div>
          )}
          <div className="flex space-x-4">
            {(product.images ?? [product.image]).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} - ${i + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                  mainImage === img ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Detalii */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl font-semibold text-primary">
            {product.price.toFixed(2)} RON
          </p>
          <div className="flex gap-4">
            <Button onClick={handleCart}>Adaugă în coș</Button>
            <Button onClick={toggleWishlist} variant="outline">
              {isWished ? "Șterge din wishlist" : "Adaugă la wishlist"}
            </Button>
          </div>
        </div>
      </div>

      {/* Produse similare */}
      {similarProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Produse similare</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((simProduct) => (
              <ProductCard key={simProduct.id} product={simProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
