import { useAppSelector } from "../store/hooks";
import CartItem from "../components/cart/CartItem";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { clearCart } from "../store/slice/cartSlice";
import { useAppDispatch } from "../store/hooks";
import { useEffect, useState } from "react";

export default function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const [total, setTotal] = useState(0);

  // Calculul totalului ținând cont de prețurile actualizate
  useEffect(() => {
    const newTotal = items.reduce((acc, item) => {
      let itemPrice = item.price;
      
      // Dacă există basePrice și variante, calculăm prețul corect
      if (item.basePrice !== undefined) {
        itemPrice = item.basePrice;
        
        // Adăugăm modificatorul de preț pentru mărime, dacă există
        if (item.selectedSize && item.variants?.sizes) {
          const size = item.variants.sizes.find(s => s.id === item.selectedSize);
          if (size?.priceModifier) {
            itemPrice += size.priceModifier;
          }
        }
      }
      
      return acc + (itemPrice * item.quantity);
    }, 0);
    
    setTotal(newTotal);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <Link to="/shop">
          <Button className="mt-4">See Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} product={item} />
        ))}
      </div>
      
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">Subtotal:</span>
          <span className="text-xl font-bold">{total.toFixed(2)} $</span>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Shipping:</span>
          <span className="text-gray-600">Calculated at checkout</span>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <span className="text-2xl font-semibold">Total:</span>
          <span className="text-2xl font-bold">{total.toFixed(2)} $</span>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between items-center">
        <Link to="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        
        <div className="flex gap-4">
          <Button
            variant="destructive"
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </Button>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}