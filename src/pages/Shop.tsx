import { useState } from "react";
import ProductGrid from "../components/catalog/ProductGrid";
import { useProductsFromFirestore } from "../hooks/products/useProductsFromFirestore";

export default function ShopPage() {
  const { products = [], loading, error } = useProductsFromFirestore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const [sortBy, setSortBy] = useState<string>("");

  // Extrage categorii în mod sigur
  const allCategories = Array.from(
    new Set(
      products
        .filter(p => p.categories && Array.isArray(p.categories))
        .flatMap(p => p.categories)
        .filter(Boolean)
    )
  );

  // Verifică dacă sunt filtre active
  const hasActiveFilters = 
    selectedCategory !== null || 
    minPrice !== 0 || 
    maxPrice !== Infinity || 
    sortBy !== "";

  const filteredProducts = hasActiveFilters 
    ? products
        .filter((product) => {
          const hasCategories = product.categories && Array.isArray(product.categories);
          const matchesCategory =
            !selectedCategory || 
            (hasCategories && product.categories.includes(selectedCategory));
          const matchesPrice =
            product.price >= minPrice && product.price <= maxPrice;
          return matchesCategory && matchesPrice;
        })
        .sort((a, b) => {
          if (sortBy === "name-asc") return a.name.localeCompare(b.name);
          if (sortBy === "name-desc") return b.name.localeCompare(a.name);
          if (sortBy === "price-asc") return a.price - b.price;
          if (sortBy === "price-desc") return b.price - a.price;
          return 0;
        })
    : products; // Dacă nu sunt filtre active, returnează toate produsele

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Se încarcă produsele...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        Eroare la încărcarea produselor: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-[250px_1fr] gap-6">
      <aside className="space-y-6 shadow-right pr-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-4">Categories</h2>
          <ul className="space-y-2">
            <li>
              <button
                className={`cursor-pointer text-base font-medium hover:bg-gray-300 w-full text-start px-1 ${
                  selectedCategory === null ? "font-bold text-primary" : ""
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                Toate categoriile
              </button>
            </li>
            {allCategories.map((cat) => (
              <li key={cat}>
                <button
                  className={`cursor-pointer text-base font-medium hover:bg-gray-300 w-full text-start px-1 ${
                    selectedCategory === cat ? "font-bold text-primary" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-4">Price</h2>
          <input
            type="number"
            placeholder="Minim"
            className="w-full mb-2 p-2 border rounded"
            onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
          />
          <input
            type="number"
            placeholder="Maxim"
            className="w-full p-2 border rounded"
            onChange={(e) =>
              setMaxPrice(e.target.value ? Number(e.target.value) : Infinity)
            }
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-4">Sort by</h2>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
          >
            <option value="">Default</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setMinPrice(0);
              setMaxPrice(Infinity);
              setSortBy("");
            }}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Reset filters
          </button>
        )}
      </aside>

      <section>
        <h1 className="text-2xl font-bold mb-6">Products</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nu există produse disponibile
            </p>
          </div>
        ) : (
          <>
            {hasActiveFilters && filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nu s-au găsit produse care să se potrivească cu filtrele
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setMinPrice(0);
                    setMaxPrice(Infinity);
                    setSortBy("");
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Resetează filtrele
                </button>
              </div>
            ) : (
              <ProductGrid 
                products={filteredProducts} 
                showFiltersSummary={hasActiveFilters}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}