import type { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}
export default function ProductGrid({ products}: ProductGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product}  />
      ))}
    </div>
  )
}