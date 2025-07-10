import type { Product } from "../../types/product";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/slice/cartSlice";

interface CartItemProps {
  product: Product & { quantity: number };
}

export default function CartItem({ product }: CartItemProps) {
  const dispatch = useDispatch();
  

  const handleQuantityChange = (newQuantity: number) => {
    // Ensure quantity is at least 1
    const quantity = Math.max(1, newQuantity);
    dispatch(updateQuantity({ id: product.id, quantity }));
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex flex-row space-x-4">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
        />

        <div className="flex-1">
          <h4 className="font-semibold">{product.name}</h4>
          
          <div className="flex items-center mt-1">
            {/* Quantity Selector */}
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
              >
                +
              </Button>
            </div>

            <span className="mx-2 text-gray-400">|</span>
            
            <p className="text-sm text-gray-500">
              {product.price.toFixed(2)} $
            </p>
          </div>

          <p className="text-sm font-medium mt-1">
            Total: {(product.price * product.quantity).toFixed(2)} $
          </p>
        </div>
      </div>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={() => dispatch(removeFromCart(product.id))}
      >
        Remove
      </Button>
    </div>
  );
}