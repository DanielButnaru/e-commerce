import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAppSelector } from "../../store/hooks";
import { Link } from "react-router-dom";

const CartButton = () => {
  const items = useAppSelector((state) => state.cart.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="relative">
      <Button onClick={toggleDropdown} variant="ghost" size="icon">
        <ShoppingCart />
      </Button>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg"
      >
      
        <div className="py-2 border-b border-gray-200 px-4">
          <span className="font-semibold text-sm text-gray-700">Produse în coș</span>
        </div>
        <div className="py-2 max-h-60 overflow-y-auto">
          {items.length === 0 ? (
            <span className="px-4 py-2 text-sm text-gray-500">Coșul este gol</span>
          ) : (
            items.map((item) => (
              <div key={item.id} className="px-4 py-2 text-sm text-gray-700 flex justify-between items-center">
                <span className="truncate w-40">{item.name}</span>
                <span>x{item.quantity}</span>
              </div>
            ))
          )}
        </div>
        <div className="py-2 border-t border-gray-200 text-center">
          <Link to="/cart">
            <Button variant="secondary" size="sm" className="w-[90%]">
              Vezi coșul
            </Button>
          </Link>
        </div>
      </Dropdown>
    </div>
  );
};

export default CartButton;
