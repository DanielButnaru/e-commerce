import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Button } from "../../../components/ui/button";

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !stock || !category || !imageUrl) {
      alert("Completează toate câmpurile");
      return;
    }
    console.log({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl,
      createdAt: serverTimestamp(),
    });
    await addDoc(collection(db, "products"), {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl,
      createdAt: serverTimestamp(),
    });

    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-4 border p-4 rounded shadow"
    >
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
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
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
            onChange={(e) =>
              setStock(e.target.value === "" ? "" : Number(e.target.value))
            }
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
        <Button type="submit">Adaugă produs</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Anulează
        </Button>
      </div>
    </form>
  );
}
