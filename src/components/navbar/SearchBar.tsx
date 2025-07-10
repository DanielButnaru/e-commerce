import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { type Product } from "../../types/product";
import { products } from "../../data/products";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [searchItem, setSearchItem] = useState("");
  const [filteredItems, setFilteredItems] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (searchItem.trim() === "") {
      setFilteredItems([]);
      setShowDropdown(false);
      return;
    }

    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(searchItem.toLowerCase())
    );

    setFilteredItems(filtered);
    setShowDropdown(true);
  }, [searchItem]);

  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        placeholder="Caută produse..."
        className="pl-8 pr-4 h-9 w-56"
      />
      {showDropdown && filteredItems.length > 0 && (
        <div className="absolute top-10 left-0 w-56 bg-white border rounded shadow z-50">
          {filteredItems.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              onClick={() => {
                setSearchItem("");
                setShowDropdown(false);
              }}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {product.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
