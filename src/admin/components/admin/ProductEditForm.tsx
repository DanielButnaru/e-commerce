import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Button } from "../../../components/ui/button";

interface ProductEditFormProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductEditForm({ product, onSuccess, onCancel }: ProductEditFormProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [category, setCategory] = useState(product.category);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !stock || !category || !imageUrl) {
      alert("Completează toate câmpurile");
      return;
    }

    const productRef = doc(db, "products", product.id);

    await updateDoc(productRef, {
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow bg-white">
      <div>
        <label className="block mb-1 font-medium">Nume produs</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Descriere</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Preț (RON)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border rounded p-2"
            min={0}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Stoc</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full border rounded p-2"
            min={0}
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Categorie</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">URL imagine</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit">Salvează modificările</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Anulează</Button>
      </div>
    </form>
  );
}
