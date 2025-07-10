// admin/AdminProducts.tsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Button } from "../../../components/ui/button";
import ProductForm from "../../components/admin/ProductForm";
import toast from "react-hot-toast";
import ProductEditDialog from "../../components/admin/ProductEditDialog";
import { type Product } from "../../../types/product";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const prods: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        prods.push({ 
          id: docSnap.id,
          ...data,
          // Convert Firestore Timestamps to Date
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        });
      });
      setProducts(prods);
    } catch (err) {
      toast.error("Eroare la încărcarea produselor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
      toast.success("Produs șters");
    } catch (err) {
      toast.error("Eroare la ștergerea produsului");
      console.error(err);
    }
  };

  const handleAddSuccess = () => {
    setShowForm(false);
    fetchProducts();
    toast.success("Produs adăugat/editat");
  };

  const renderVariantInfo = (product: Product) => {
    if (!product.variants) return "—";
    
    const sizeCount = product.variants.sizes?.length || 0;
    const colorCount = product.variants.colors?.length || 0;
    return `${sizeCount} mărimi, ${colorCount} culori`;
  };

  const renderPriceInfo = (product: Product) => {
    if (product.isOnSale && product.salePrice) {
      return (
        <div className="flex flex-col">
          <span className="text-red-500 font-medium">
            {product.salePrice.toFixed(2)} RON
          </span>
          <span className="line-through text-sm text-gray-500">
            {product.basePrice.toFixed(2)} RON
          </span>
        </div>
      );
    }
    return ;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestionare Produse</h1>
        <Button onClick={() => setShowForm(true)}>Adaugă produs</Button>
      </div>

      {showForm && (
        <ProductForm
          onSuccess={handleAddSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <p>Se încarcă...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Imagine</th>
                <th className="px-4 py-3 text-left">Nume/SKU</th>
                <th className="px-4 py-3 text-left">Preț</th>
                <th className="px-4 py-3 text-left">Stoc</th>
                <th className="px-4 py-3 text-left">Variante</th>
                <th className="px-4 py-3 text-left">Categorii</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={
                        prod.thumbnail ||
                        (prod.images?.length ? prod.images[0] : "/placeholder.jpg")
                      }
                      alt={prod.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{prod.name}</div>
                    <div className="text-sm text-gray-500">{prod.sku}</div>
                  </td>
                  <td className="px-4 py-3">
                    {renderPriceInfo(prod)}
                  </td>
                  <td className="px-4 py-3">
                    {prod.manageStock ? prod.stock : "∞"}
                    {prod.lowStockThreshold && prod.stock <= prod.lowStockThreshold && (
                      <span className="ml-2 text-xs text-red-500">Stoc scăzut</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {renderVariantInfo(prod)}
                  </td>
                  <td className="px-4 py-3">
                    {Array.isArray(prod.categories)
                      ? prod.categories.join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      prod.stockStatus === 'in-stock' 
                        ? 'bg-green-100 text-green-800' 
                        : prod.stockStatus === 'out-of-stock' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {prod.stockStatus === 'in-stock' 
                        ? 'În stoc' 
                        : prod.stockStatus === 'out-of-stock' 
                          ? 'Stoc epuizat' 
                          : 'Precomandă'}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <ProductEditDialog 
                      product={prod} 
                      onSuccess={fetchProducts} 
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(prod.id)}
                    >
                      Șterge
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}