import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { type Product } from "../../types/product";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const SearchBar = () => {
  const [searchItem, setSearchItem] = useState("");
  const [filteredItems, setFilteredItems] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const prods: Product[] = [];
        querySnapshot.forEach((docSnap) => {
          prods.push({ id: docSnap.id, ...(docSnap.data() as Product) });
        });
        setAllProducts(prods);
      } catch (err) {
        console.error("Eroare la încărcarea produselor", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchItem.trim() === "") {
      setFilteredItems([]);
      setShowDropdown(false);
      return;
    }

    const filtered = allProducts.filter((item) =>
      item.name.toLowerCase().includes(searchItem.toLowerCase())
    );

    setFilteredItems(filtered);
    setShowDropdown(true);
  }, [searchItem, allProducts]);

  const handleSelectProduct = (product: Product) => {
    setFilteredItems([product]);
    setShowDropdown(false);
    setSearchItem(product.name);
  };

  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        placeholder="Search products..."
        className="pl-8 pr-4 h-9 w-56 "
      />
      {showDropdown && filteredItems.length > 0 && (
        <div className="absolute top-10 left-0 w-56 bg-white border rounded shadow z-50">
          {filteredItems.map((product) => (
            <div
              key={product.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectProduct(product)}
            >
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;