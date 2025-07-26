import type { Product } from "../../types/product";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/slice/cartSlice";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { Link } from "react-router-dom";

interface CartItemProps {
  product: Product & {
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
  };
}

export default function CartItem({ product }: CartItemProps) {
  const dispatch = useDispatch();
  const [currentPrice, setCurrentPrice] = useState(0);

  // Actualizează prețul în funcție de variantele selectate
  useEffect(() => {
    let calculatedPrice = product.basePrice || product.salePrice || 0;

    // Aplică modificator de preț pentru mărimea selectată
    if (product.selectedSize && product.variants?.sizes) {
      const size = product.variants.sizes.find(
        (s) => s.id === product.selectedSize
      );
      if (size?.priceModifier) {
        calculatedPrice += size.priceModifier;
      }
    }

    setCurrentPrice(calculatedPrice);
  }, [
    product.selectedSize,
    product.variants,
    product.basePrice,
    product.salePrice,
  ]);

  const handleQuantityChange = (newQuantity: number) => {
    const quantity = Math.max(1, newQuantity);
    if (product.id) {
      dispatch(
        updateQuantity({
          id: product.id,
          quantity,
          selectedSize: product.selectedSize,
          selectedColor: product.selectedColor,
        })
      );
    } else {
      console.error("Product ID is undefined");
    }
  };

  const getSizeName = () => {
    if (!product.selectedSize) return null;
    return product.variants?.sizes?.find((s) => s.id === product.selectedSize)
      ?.name;
  };

  const getColor = () => {
    if (!product.selectedColor) return null;
    return product.variants?.colors?.find(
      (c) => c.id === product.selectedColor
    );
  };

  // Formatare sigură a prețului
  const formatPrice = (price: number) => {
    return (price || 0).toFixed(2);
  };

  return (
    <div className="flex items-start justify-between  py-4 border-b gap-4">
      <div className="flex flex-row items-center space-x-4 flex-1">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-16 h-16 object-containbn  rounded"
          />
        </Link>

        <div className="flex-1">
          <div className="flex justify-between items-center">
            <Link to={`/product/${product.id}`}>
              <h4 className="font-semibold text-black">{product.name}</h4>
            </Link>
            {/* {product.isOnSale && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                Sale
              </span>
            )} */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => product.id && dispatch(removeFromCart(product.id))}
              className=" cursor-pointer"
            >
              <Trash />
            </Button>
          </div>

          {/* Afișare variante selectate */}
          <div className="space-y-1">
            {product.selectedSize && (
              <p className="text-sm text-gray-600">
                Size: <span className="font-medium">{getSizeName()}</span>
              </p>
            )}

            {product.selectedColor && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">Color: </p>
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: getColor()?.hexCode }}
                  title={getColor()?.name}
                />
                <span className="text-sm font-medium">{getColor()?.name}</span>
              </div>
            )}
          </div>

          {/* Selector cantitate */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-none"
                onClick={() => handleQuantityChange(product.quantity - 1)}
                disabled={product.quantity <= 1}
              >
                -
              </Button>

              <span className="px-3 text-sm font-medium">
                {product.quantity}
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-none"
                onClick={() => handleQuantityChange(product.quantity + 1)}
                disabled={product.quantity >= 10}
              >
                +
              </Button>
            </div>
            {/* Preț total */}
            <p className="text-base font-bold mt-1">
              {formatPrice(currentPrice * product.quantity)} $
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
