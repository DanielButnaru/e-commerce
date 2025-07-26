import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useAppSelector } from "../../store/hooks";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "../cart/CartItem";

const CartButton = () => {
  const items = useAppSelector((state) => state.cart.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative">
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className='cursor-pointer'>
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="h-full">
            <SheetTitle className="text-center mt-8 pb-2 text-lg md:text-2xl border-b border-gray-200">Cart</SheetTitle>
            <SheetDescription className="!h-full">
              <div className="flex flex-col justify-between gap-1 h-full">
                <div className="py-2  border-gray-200 text-center mt-10">
                  {items.length === 0 ? (
                    <span className="px-4 py-2 text-sm text-gray-500">
                      Cart is empty
                    </span>
                  ) : (
                    items.map((item) => (
                      <CartItem key={item.id} product={item} />
                    ))
                  )}
                </div>
                <div className="py-3 border-t border-gray-200 text-center">
                  <Link to="/cart">
                    <Button className="hover:cursor-pointer hover:scale-101">
                      Go to cart
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

    </div>
  );
};

export default CartButton;
