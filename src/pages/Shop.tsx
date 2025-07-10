import { useState } from "react";
import ProductGrid from "../components/catalog/ProductGrid";
import type { Product } from "../types/product";
import { useProductsFromFirestore } from "../hooks/products/useProductsFromFirestore";

export default function ShopPage() {
  const { products, loading } = useProductsFromFirestore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const [sortBy, setSortBy] = useState<string>("");

  const allCategories = Array.from(
    new Set(products.flatMap((p) => p.categories))
  );

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        !selectedCategory || product.categories.includes(selectedCategory);
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
    });

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-[250px_1fr] gap-6">
      <aside className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Categorii</h2>
          <ul className="space-y-1">
            {allCategories.map((cat) => (
              <li key={cat}>
                <button
                  className={`text-sm ${
                    selectedCategory === cat ? "font-bold text-primary" : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat ? null : cat)
                  }
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Preț</h2>
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
          <h2 className="text-lg font-semibold mb-2">Sortează după</h2>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">-- Selectează --</option>
            <option value="name-asc">Nume (A-Z)</option>
            <option value="name-desc">Nume (Z-A)</option>
            <option value="price-asc">Preț crescător</option>
            <option value="price-desc">Preț descrescător</option>
          </select>
        </div>
      </aside>

      <section>
        <h1 className="text-2xl font-bold mb-6">Catalog Produse</h1>
        {loading ? (
          <p>Se încarcă produsele...</p>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </section>
    </div>
  );
}
