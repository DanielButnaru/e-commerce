import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  showFiltersSummary?: boolean;
}
export default function ProductGrid({
  products,
  showFiltersSummary = false,
}: ProductGridProps) {
  console.log("Products in grid:", products); // Verifică datele primite

  if (!products || products.length === 0) {
    return <div>Nu există produse de afișat</div>;
  }

  return (
    <div>
      {showFiltersSummary && (
        <div className="mb-4 text-sm text-gray-500">
          Afișare {products.length} produse filtrate
        </div>
      )}
      <div className="grid gap-8 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
