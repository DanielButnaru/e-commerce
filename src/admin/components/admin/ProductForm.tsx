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
  const [categoryInput, setCategoryInput] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [imagesInput, setImagesInput] = useState(""); // pentru multiple imagini, input text separate prin virgulă

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !description ||
      !price ||
      !stock ||
      !categoryInput ||
      !thumbnail
    ) {
      alert("Completează toate câmpurile obligatorii");
      return;
    }

    // Procesăm categoriile
    const categories = categoryInput
      .split(/[,;]/)
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);

    if (categories.length === 0) {
      alert("Introdu cel puțin o categorie validă");
      return;
    }

    // Procesăm imagini multiple
    const imageUrl = imagesInput
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    await addDoc(collection(db, "products"), {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      categories,
      thumbnail,
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
        <label className="block mb-1 font-medium">Categorii</label>
        <input
          type="text"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Separate prin virgulă sau punct și virgulă (ex: electronice, gadget-uri)"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Introduceți categorii separate prin virgulă sau punct și virgulă
        </p>
      </div>

      <div>
        <label className="block mb-1 font-medium">Thumbnail (URL imagine)</label>
        <input
          type="text"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="URL imagine thumbnail"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Imagini multiple (URL-uri separate prin virgulă)
        </label>
        <input
          type="text"
          value={imagesInput}
          onChange={(e) => setImagesInput(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="URL1, URL2, URL3"
        />
        <p className="text-sm text-gray-500 mt-1">
          Introduceți URL-urile imaginilor separate prin virgulă
        </p>
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
