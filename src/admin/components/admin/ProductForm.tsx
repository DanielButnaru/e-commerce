import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
  // Basic Information
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  // Pricing
  const [basePrice, setBasePrice] = useState<number | "">("");
  const [salePrice, setSalePrice] = useState<number | "">("");
  const [isOnSale, setIsOnSale] = useState(false);
  const [costPrice, setCostPrice] = useState<number | "">("");

  // Inventory
  const [stock, setStock] = useState<number | "">("");
  const [lowStockThreshold, setLowStockThreshold] = useState<number | "">(5);
  const [stockStatus, setStockStatus] = useState<"in-stock" | "out-of-stock" | "pre-order">("in-stock");
  const [manageStock, setManageStock] = useState(true);

  // Media
  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");

  // Organization
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Shipping
  const [weight, setWeight] = useState<number | "">("");
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: ""
  });

  // Variants
  const [hasVariants, setHasVariants] = useState(false);
  const [sizes, setSizes] = useState<Array<{
    id: string;
    name: string;
    priceModifier: number;
    stock: number;
  }>>([]);
  const [colors, setColors] = useState<Array<{
    id: string;
    name: string;
    hexCode: string;
    image: string;
  }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name || !basePrice || !thumbnail) {
      alert("Completează câmpurile obligatorii");
      return;
    }

    // Process images
    const processedImages = imageInput
      .split(",")
      .map(url => url.trim())
      .filter(url => url.length > 0);

    // Create product data
    const productData = {
      // Basic info
      name,
      sku: sku || undefined,
      description,
      shortDescription: shortDescription || undefined,
      
      // Pricing
      basePrice: Number(basePrice),
      salePrice: salePrice ? Number(salePrice) : undefined,
      isOnSale,
      costPrice: costPrice ? Number(costPrice) : undefined,
      
      // Inventory
      stock: manageStock ? Number(stock) : 0,
      lowStockThreshold: Number(lowStockThreshold),
      stockStatus,
      manageStock,
      
      // Media
      thumbnail,
      images: [...processedImages],
      
      // Organization
      categories,
      brand: brand || undefined,
      tags,
      
      // Shipping
      weight: weight ? Number(weight) : undefined,
      dimensions: {
        length: dimensions.length ? Number(dimensions.length) : undefined,
        width: dimensions.width ? Number(dimensions.width) : undefined,
        height: dimensions.height ? Number(dimensions.height) : undefined,
      },
      
      // Variants
      variants: hasVariants ? {
        sizes,
        colors
      } : undefined,
      
      // System
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "products"), productData);
      onSuccess();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Eroare la adăugarea produsului");
    }
  };

  const addSize = () => {
    setSizes([...sizes, {
      id: `size_${Date.now()}`,
      name: "",
      priceModifier: 0,
      stock: 0
    }]);
  };

  const addColor = () => {
    setColors([...colors, {
      id: `color_${Date.now()}`,
      name: "",
      hexCode: "#000000",
      image: ""
    }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 max-h-screen overflow-y-auto">
      <h2 className="text-xl font-bold">Adăugare produs nou</h2>
      
      {/* Basic Information Section */}
      <div className="space-y-4 border-b pb-4">
        <h3 className="font-medium">Informații de bază</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Nume produs*</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>SKU</Label>
            <Input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="COD-PRODUS-001"
            />
          </div>
        </div>
        
        <div>
          <Label>Descriere*</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 min-h-[100px]"
            required
          />
        </div>
        
        <div>
          <Label>Descriere scurtă</Label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full border rounded p-2 min-h-[60px]"
          />
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-4 border-b pb-4">
        <h3 className="font-medium">Prețuri</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Preț de bază*</Label>
            <Input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value === "" ? "" : Number(e.target.value))}
              min={0}
              step="0.01"
              required
            />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="sale-toggle" 
                checked={isOnSale}
                onCheckedChange={setIsOnSale}
              />
              <Label htmlFor="sale-toggle">Reducere</Label>
            </div>
            {isOnSale && (
              <Input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value === "" ? "" : Number(e.target.value))}
                min={0}
                step="0.01"
                className="mt-2"
              />
            )}
          </div>
          
          <div>
            <Label>Preț de cost</Label>
            <Input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value === "" ? "" : Number(e.target.value))}
              min={0}
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="space-y-4 border-b pb-4">
        <h3 className="font-medium">Stoc</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="manage-stock" 
                checked={manageStock}
                onCheckedChange={setManageStock}
              />
              <Label htmlFor="manage-stock">Gestionează stoc</Label>
            </div>
            {manageStock && (
              <>
                <Input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                  min={0}
                  className="mt-2"
                  placeholder="Stoc"
                />
                <Input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value === "" ? "" : Number(e.target.value))}
                  min={0}
                  className="mt-2"
                  placeholder="Prag stoc scăzut"
                />
              </>
            )}
          </div>
          
          <div>
            <Label>Status stoc</Label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value as any)}
              className="w-full border rounded p-2"
            >
              <option value="in-stock">În stoc</option>
              <option value="out-of-stock">Stoc epuizat</option>
              <option value="pre-order">Precomandă</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="space-y-4 border-b pb-4">
        <h3 className="font-medium">Imagini</h3>
        <div>
          <Label>Thumbnail (URL imagine principală)*</Label>
          <Input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label>Imagini suplimentare (URL-uri separate prin virgulă)</Label>
          <Input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
        </div>
      </div>

      {/* Variants Section */}
      <div className="space-y-4 border-b pb-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="has-variants" 
            checked={hasVariants}
            onCheckedChange={setHasVariants}
          />
          <Label htmlFor="has-variants">Are variante (mărimi/culori)</Label>
        </div>
        
        {hasVariants && (
          <div className="space-y-4">
            {/* Sizes */}
            <div>
              <h4 className="font-medium mb-2">Mărimi</h4>
              {sizes.map((size, index) => (
                <div key={size.id} className="grid grid-cols-4 gap-2 mb-2">
                  <Input
                    placeholder="Nume (ex: S)"
                    value={size.name}
                    onChange={(e) => {
                      const newSizes = [...sizes];
                      newSizes[index].name = e.target.value;
                      setSizes(newSizes);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Modificator preț"
                    value={size.priceModifier}
                    onChange={(e) => {
                      const newSizes = [...sizes];
                      newSizes[index].priceModifier = Number(e.target.value);
                      setSizes(newSizes);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Stoc"
                    value={size.stock}
                    onChange={(e) => {
                      const newSizes = [...sizes];
                      newSizes[index].stock = Number(e.target.value);
                      setSizes(newSizes);
                    }}
                    min={0}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => setSizes(sizes.filter((_, i) => i !== index))}
                  >
                    Șterge
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addSize} variant="outline">
                Adaugă mărime
              </Button>
            </div>
            
            {/* Colors */}
            <div>
              <h4 className="font-medium mb-2">Culori</h4>
              {colors.map((color, index) => (
                <div key={color.id} className="grid grid-cols-4 gap-2 mb-2">
                  <Input
                    placeholder="Nume culoare"
                    value={color.name}
                    onChange={(e) => {
                      const newColors = [...colors];
                      newColors[index].name = e.target.value;
                      setColors(newColors);
                    }}
                  />
                  <Input
                    type="color"
                    value={color.hexCode}
                    onChange={(e) => {
                      const newColors = [...colors];
                      newColors[index].hexCode = e.target.value;
                      setColors(newColors);
                    }}
                    className="h-10 p-1"
                  />
                  <Input
                    placeholder="URL imagine"
                    value={color.image}
                    onChange={(e) => {
                      const newColors = [...colors];
                      newColors[index].image = e.target.value;
                      setColors(newColors);
                    }}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => setColors(colors.filter((_, i) => i !== index))}
                  >
                    Șterge
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addColor} variant="outline">
                Adaugă culoare
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Organization Section */}
      <div className="space-y-4 border-b pb-4">
        <h3 className="font-medium">Organizare</h3>
        
        <div>
          <Label>Categorii (separate prin virgulă)</Label>
          <Input
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onBlur={() => {
              if (categoryInput) {
                const newCategories = categoryInput
                  .split(/[,;]/)
                  .map(cat => cat.trim())
                  .filter(cat => cat.length > 0);
                setCategories([...new Set([...categories, ...newCategories])]);
                setCategoryInput("");
              }
            }}
            placeholder="electronice, gadget-uri"
          />
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat, index) => (
                <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center">
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={() => setCategories(categories.filter((_, i) => i !== index))}
                    className="ml-1 text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <Label>Brand</Label>
          <Input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        
        <div>
          <Label>Etichete (separate prin virgulă)</Label>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onBlur={() => {
              if (tagInput) {
                const newTags = tagInput
                  .split(/[,;]/)
                  .map(tag => tag.trim())
                  .filter(tag => tag.length > 0);
                setTags([...new Set([...tags, ...newTags])]);
                setTagInput("");
              }
            }}
            placeholder="redus, nou, promo"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    className="ml-1 text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shipping Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Transport</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Greutate (kg)</Label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
              min={0}
              step="0.01"
            />
          </div>
        </div>
        
        <div>
          <Label>Dimensiuni (cm)</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Lungime"
              value={dimensions.length}
              onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
            />
            <Input
              placeholder="Lățime"
              value={dimensions.width}
              onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
            />
            <Input
              placeholder="Înălțime"
              value={dimensions.height}
              onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Anulează
        </Button>
        <Button type="submit">Salvează produs</Button>
      </div>
    </form>
  );
}