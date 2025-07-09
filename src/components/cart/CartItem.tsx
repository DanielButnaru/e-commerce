import type { Product } from "../../types/product";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../store/slice/cartSlice";

interface CartItemProps {
  product: Product & { quantity: number }
}

export default function CartItem({ product }: CartItemProps) {
  const dispatch = useDispatch()

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h4 className="font-semibold">{product.name}</h4>
        <p className="text-sm text-gray-500">x{product.quantity}</p>
        <p className="text-sm font-medium">{(product.price * product.quantity).toFixed(2)} RON</p>
      </div>
      <Button
        variant="default"
        onClick={() => dispatch(removeFromCart(product.id))}
      >
        Șterge
      </Button>
    </div>
  )
}
