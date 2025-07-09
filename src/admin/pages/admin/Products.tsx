// admin/AdminProducts.tsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Button } from "../../../components/ui/button";
import ProductForm from "../../components/admin/ProductForm";
import toast from "react-hot-toast";
import ProductEditDialog from "../../components/admin/ProductEditDialog";

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: string[];
  thumbnail?: string;
  imageUrl?: string[];
}

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
        prods.push({ id: docSnap.id, ...(docSnap.data() as Product) });
      });
      setProducts(prods);
    } catch (err) {
      toast.error("Eroare la încărcarea produselor");
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
    } catch {
      toast.error("Eroare la ștergerea produsului");
    }
  };

  const handleAddSuccess = () => {
    setShowForm(false);
    fetchProducts();
    toast.success("Produs adăugat/editat");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
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
        <p>Se încarcă...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Imagine</th>
              <th className="border border-gray-300 p-2">Nume</th>
              <th className="border border-gray-300 p-2">Preț</th>
              <th className="border border-gray-300 p-2">Stoc</th>
              <th className="border border-gray-300 p-2">Categorie</th>
              <th className="border border-gray-300 p-2">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td className="border border-gray-300 p-2">
                  <img
                    src={
                      prod.thumbnail ||
                      (prod.imageUrl?.length
                        ? prod.imageUrl[0]
                        : "/placeholder.jpg")
                    }
                    alt={prod.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="border border-gray-300 p-2">{prod.name}</td>
                <td className="border border-gray-300 p-2">
                  {prod.price.toFixed(2)} RON
                </td>
                <td className="border border-gray-300 p-2">{prod.stock}</td>
                <td className="border border-gray-300 p-2">
                  {Array.isArray(prod.categories)
                    ? prod.categories.join(", ")
                    : "—"}
                </td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <ProductEditDialog product={prod} onSuccess={fetchProducts} />
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
      )}
    </div>
  );
}
