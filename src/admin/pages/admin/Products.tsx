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

// Define the structure of a Product
interface Product {
  id?: string; // Optional because new products won't have an ID until saved
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export default function AdminProducts() {
  // State for storing the list of products
  const [products, setProducts] = useState<Product[]>([]);
  // State to track loading status
  const [loading, setLoading] = useState(false);
  // State to control the visibility of the add product form
  const [showForm, setShowForm] = useState(false);

  // Function to fetch products from Firestore
  const fetchProducts = async () => {
    setLoading(true); // Start loading
    // Get all documents from the 'products' collection
    const querySnapshot = await getDocs(collection(db, "products"));
    const prods: Product[] = [];
    // Convert each document to a Product object
    querySnapshot.forEach((doc) => {
      prods.push({ id: doc.id, ...(doc.data() as Product) });
    });
    setProducts(prods); // Update state with fetched products
    setLoading(false); // End loading
  };

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to delete a product
  const handleDelete = async (id?: string) => {
    if (!id) return; // Guard clause if no ID provided
    // Delete document from Firestore
    await deleteDoc(doc(db, "products", id));
    // Refresh the product list
    fetchProducts();
  };

  // Callback when a product is successfully added
  const handleAddSuccess = () => {
    setShowForm(false); // Hide the form
    fetchProducts(); // Refresh the product list
    toast.success("Produs editat"); // Show success notification
  };

  return (
    <div>
      {/* Header section with title and add button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestionare Produse</h1>
        <Button onClick={() => setShowForm(true)}>Adaugă produs</Button>
      </div>

      {/* Conditionally render the add product form */}
      {showForm && (
        <ProductForm
          onSuccess={handleAddSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Show loading state or product table */}
      {loading ? (
        <p>Se încarcă...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Nume</th>
              <th className="border border-gray-300 p-2">Preț</th>
              <th className="border border-gray-300 p-2">Stoc</th>
              <th className="border border-gray-300 p-2">Categorie</th>
              <th className="border border-gray-300 p-2">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through products to create table rows */}
            {products.map((prod) => (
              <tr key={prod.id}>
                <td className="border border-gray-300 p-2">{prod.name}</td>
                <td className="border border-gray-300 p-2">{prod.price} RON</td>
                <td className="border border-gray-300 p-2">{prod.stock}</td>
                <td className="border border-gray-300 p-2">{prod.category}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  {/* Edit dialog component */}
                  <ProductEditDialog
                    product={prod as Product}
                    onSuccess={() => fetchProducts()}
                  />

                  {/* Delete button */}
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