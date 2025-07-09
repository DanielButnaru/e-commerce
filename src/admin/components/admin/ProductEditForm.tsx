import { useState } from "react";
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
    categories: string[];
    thumbnail: string;
    imageUrl: string[]; // <- corect
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductEditForm({ product, onSuccess, onCancel }: ProductEditFormProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [category, setCategory] = useState(product.categories.join(", "));
  const [thumbnail, setThumbnail] = useState(product.thumbnail);
  const [imageUrl, setImageUrl] = useState<string[]>(product.imageUrl || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !stock || !category || !thumbnail) {
      alert("Completează toate câmpurile");
      return;
    }

    const categories = category
      .split(/[,;]/)
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);

    if (categories.length === 0) {
      alert("Introdu cel puțin o categorie validă");
      return;
    }

    const productRef = doc(db, "products", product.id);

    await updateDoc(productRef, {
      name,
      description,
      price,
      stock,
      categories,
      thumbnail,
      imageUrl, // <- aici folosim lista de imagini
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
        <label className="block mb-1 font-medium">Categorii (separate prin virgulă)</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Thumbnail (URL)</label>
        <input
          type="text"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        {thumbnail && (
          <img src={thumbnail} alt="Thumbnail" className="mt-2 w-32 h-32 object-cover rounded border" />
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Imagini suplimentare</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="URL imagine"
            className="flex-1 border rounded p-2"
          />
          <Button
            type="button"
            onClick={() => {
              if (newImageUrl.trim()) {
                setImageUrl((prev) => [...prev, newImageUrl.trim()]);
                setNewImageUrl("");
              }
            }}
          >
            Adaugă
          </Button>
        </div>

        {imageUrl.length > 0 && (
          <ul className="space-y-2">
            {imageUrl.map((url, index) => (
              <li key={index} className="flex items-center gap-2">
                <img src={url} alt={`img-${index}`} className="w-16 h-16 object-cover rounded" />
                <span className="text-sm truncate">{url}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setImageUrl(imageUrl.filter((_, i) => i !== index))}
                >
                  Șterge
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex space-x-4">
        <Button type="submit">Salvează modificările</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Anulează
        </Button>
      </div>
    </form>
  );
}
