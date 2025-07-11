import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slice/cartSlice";
import { Heart } from "lucide-react";
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
  const { products } = useProductsFromFirestore();

  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [colorImages, setColorImages] = useState<string[]>([]);

  const isWished = useAppSelector((state) =>
    state.wishlist.items.some((item) => item.id === id)
  );

  useEffect(() => {
    if (product?.thumbnail) {
      setMainImage(product.thumbnail);
    } else if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    } else {
      setMainImage(undefined);
    }

    // Resetă selecțiile când se schimbă produsul
    setSelectedSize(null);
    setSelectedColor(null);
  }, [product]);

  // Actualizează imaginile când se selectează o culoare
  useEffect(() => {
    if (selectedColor && product?.variants?.colors) {
      const color = product.variants.colors.find(c => c.id === selectedColor);
      if (color?.image) {
        // Dacă culoarea are o imagine specifică, o setăm ca imagine principală
        setMainImage(color.image);
        setColorImages([color.image]);
      } else {
        // Altfel, folosim imaginile generale ale produsului
        setColorImages(product.images || []);
      }
    } else {
      // Dacă nu e selectată nicio culoare, folosim toate imaginile produsului
      setColorImages(product?.images || []);
    }
  }, [selectedColor, product]);

  const calculatePrice = () => {
    let finalPrice = product?.basePrice || 0;
    
    if (selectedSize && product?.variants?.sizes) {
      const size = product.variants.sizes.find(s => s.id === selectedSize);
      if (size) {
        finalPrice += size.priceModifier;
      }
    }
    
    if (product?.isOnSale && product?.salePrice) {
      return product.salePrice;
    }
    
    return finalPrice;
  };

  const similarProducts = product
    ? products.filter(
        (p) =>
          p.id !== product.id &&
          Array.isArray(p.categories) &&
          Array.isArray(product.categories) &&
          p.categories.some((cat) => product.categories.includes(cat))
      )
    : [];

  const handleCart = () => {
    if (!product) return;

    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      price: calculatePrice(),
      quantity: 1
    };

    dispatch(addToCart(cartItem));
    toast.success("Adăugat în coș");
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10 mb-10">
        {/* Galerie imagini */}
        <div>
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-96 object-contain rounded-xl mb-4"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
              Imagine indisponibilă
            </div>
          )}
          
          <div className="flex space-x-4 overflow-x-auto py-2">
            {(colorImages.length > 0 ? colorImages : product.images || []).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} - ${i + 1}`}
                className={`w-20 h-20 object-contain rounded cursor-pointer border-2 ${
                  mainImage === img ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Detalii produs */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {product.brand && (
                <p className="text-lg text-gray-600">{product.brand}</p>
              )}
            </div>
            <button
              onClick={toggleWishlist}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label={isWished ? "Șterge din wishlist" : "Adaugă în wishlist"}
            >
              <Heart 
                className={`w-6 h-6 ${isWished ? "fill-red-500 text-red-500" : "text-gray-400"}`}
              />
            </button>
          </div>

          <div className="space-y-4">
            {/* Preț */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-primary">
                {calculatePrice().toFixed(2)} RON
              </span>
              {product.isOnSale && product.salePrice && (
                <span className="text-lg text-gray-500 line-through">
                  {product.basePrice.toFixed(2)} RON
                </span>
              )}
              {product.isOnSale && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                  Reducere
                </span>
              )}
            </div>

            {/* Status stoc */}
            <div>
              {product.stockStatus === 'out-of-stock' ? (
                <p className="text-red-500">Stoc epuizat</p>
              ) : product.stockStatus === 'pre-order' ? (
                <p className="text-blue-500">Disponibil pentru precomandă</p>
              ) : (
                <p className="text-green-500">În stoc</p>
              )}
            </div>

            {/* Variante - culori (mutat înaintea mărimilor) */}
            {product.variants?.colors?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Culori disponibile:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.colors.map((color) => (
                    <button
                      key={color.id}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColor === color.id
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.hexCode }}
                      onClick={() => {
                        setSelectedColor(color.id);
                        // Dacă culoarea are o imagine specifică, o setăm ca imagine principală
                        if (color.image) {
                          setMainImage(color.image);
                        }
                      }}
                      aria-label={color.name}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Variante - mărimi */}
            {product.variants?.sizes?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Mărimi disponibile:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((size) => (
                    <button
                      key={size.id}
                      className={`px-4 py-2 border rounded ${
                        selectedSize === size.id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-300'
                      } ${
                        size.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => setSelectedSize(size.id)}
                      disabled={size.stock <= 0}
                    >
                      {size.name}
                      {size.stock <= 0 && ' (epuizat)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Butoane acțiune */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleCart}
                disabled={product.stockStatus === 'out-of-stock'}
                className="flex-1 py-6 text-lg"
              >
                {product.stockStatus === 'out-of-stock' 
                  ? 'Stoc epuizat' 
                  : 'Adaugă în coș'}
              </Button>
            </div>
          </div>

          {/* Descriere */}
          <div className="pt-6 border-t">
            <h3 className="text-xl font-semibold mb-2">Descriere</h3>
            <p className="text-gray-700">{product.description}</p>
            {product.shortDescription && (
              <p className="text-gray-500 mt-2">{product.shortDescription}</p>
            )}
          </div>

          {/* Specificații */}
          {product.specifications?.length > 0 && (
            <div className="pt-6 border-t">
              <h3 className="text-xl font-semibold mb-2">Specificații</h3>
              <ul className="space-y-2">
                {product.specifications.map((spec, i) => (
                  <li key={i} className="flex">
                    <span className="font-medium w-1/3">{spec.key}:</span>
                    <span className="w-2/3">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Produse similare */}
      {similarProducts.length > 0 && (
        <section className="mt-12">
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