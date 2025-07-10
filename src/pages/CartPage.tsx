import { useAppSelector } from "../store/hooks";
import CartItem from "../components/cart/CartItem";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { clearCart } from "../store/slice/cartSlice";
import { useAppDispatch } from "../store/hooks";

export default function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  console.log(items);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} product={item} />
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <span className="text-lg font-semibold">Total:</span>
        <span className="text-lg font-bold">{total.toFixed(2)} $</span>
      </div>
      <div className="mt-6 text-right flex justify-end space-x-4">
        <Button
          variant="destructive"
          className="text-white cursor-pointer"
          onClick={() => dispatch(clearCart())}
        >
          Clear Cart
        </Button>
        <Button variant="default" className="text-white bg-green-600">
          <Link to="/checkout">Place the order</Link>
        </Button>
      </div>
      <div className="mt-6 text-right"></div>
    </div>
  );
}
