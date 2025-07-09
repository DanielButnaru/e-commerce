import { products } from "../data/products";
import  ProductGrid from "../components/catalog/ProductGrid";

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Catalog Produse</h1>
      <ProductGrid products={products} />
    </div>
  )
}