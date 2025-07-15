import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";

import { type Product } from "../../../types/product";

interface ProductEditFormProps {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductEditForm({ product, onSuccess, onCancel }: ProductEditFormProps) {
  // Basic Information
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku || "");
  const [description, setDescription] = useState(product.description);
  const [shortDescription, setShortDescription] = useState(product.shortDescription || "");

  // Pricing
  const [basePrice, setBasePrice] = useState(product.basePrice);
  const [salePrice, setSalePrice] = useState(product.salePrice || 0);
  const [isOnSale, setIsOnSale] = useState(product.isOnSale);
  const [costPrice, setCostPrice] = useState(product.costPrice || 0);

  // Inventory
  const [stock, setStock] = useState(product.stock);
  const [lowStockThreshold, setLowStockThreshold] = useState(product.lowStockThreshold || 5);
  const [stockStatus, setStockStatus] = useState(product.stockStatus);
  const [manageStock, setManageStock] = useState(product.manageStock || false);

  // Media
  const [thumbnail, setThumbnail] = useState(product.thumbnail);
  const [images, setImages] = useState<string[]>(product.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Organization
  const [categories, setCategories] = useState<string[]>(product.categories || []);
  const [categoryInput, setCategoryInput] = useState("");
  const [brand, setBrand] = useState(product.brand || "");
  const [tags, setTags] = useState<string[]>(product.tags || []);
  const [tagInput, setTagInput] = useState("");

  // Shipping
  const [weight, setWeight] = useState(product.weight || 0);
  const [dimensions, setDimensions] = useState({
    length: product.dimensions?.length || 0,
    width: product.dimensions?.width || 0,
    height: product.dimensions?.height || 0
  });

  // Variants
  const [hasVariants, setHasVariants] = useState(!!product.variants);
  const [sizes, setSizes] = useState(product.variants?.sizes || []);
  const [colors, setColors] = useState(product.variants?.colors || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !basePrice || !thumbnail) {
      alert("Completează câmpurile obligatorii");
      return;
    }

    const productRef = doc(db, "products", product.id!);

    try {
      await updateDoc(productRef, {
        // Basic info
        name,
        sku,
        description,
        shortDescription,
        
        // Pricing
        basePrice,
        salePrice: isOnSale ? salePrice : null,
        isOnSale,
        costPrice,
        
        // Inventory
        stock: manageStock ? stock : 0,
        lowStockThreshold,
        stockStatus,
        manageStock,
        
        // Media
        thumbnail,
        images,
        
        // Organization
        categories,
        brand,
        tags,
        
        // Shipping
        weight,
        dimensions: {
          length: dimensions.length,
          width: dimensions.width,
          height: dimensions.height
        },
        
        // Variants
        variants: hasVariants ? {
          sizes,
          colors
        } : null,
        
        // System
        updatedAt: new Date()
      });

      onSuccess();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Eroare la actualizarea produsului");
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
      <h2 className="text-xl font-bold">Editare produs</h2>
      
      {/* Basic Information Section */}
      <div className="space-y-4 border-b pb-4">
        <h3 className="font-medium">Informații de bază</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Nume produs*</Label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <Label>SKU</Label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full border rounded p-2"
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
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full border rounded p-2"
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
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full border rounded p-2 mt-2"
                min={0}
                step="0.01"
              />
            )}
          </div>
          
          <div>
            <Label>Preț de cost</Label>
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              className="w-full border rounded p-2"
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
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full border rounded p-2 mt-2"
                  min={0}
                />
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-full border rounded p-2 mt-2"
                  min={0}
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
          <Label>Imagini suplimentare</Label>
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
                  setImages([...images, newImageUrl.trim()]);
                  setNewImageUrl("");
                }
              }}
            >
              Adaugă
            </Button>
          </div>

          {images.length > 0 && (
            <ul className="space-y-2">
              {images.map((url, index) => (
                <li key={index} className="flex items-center gap-2">
                  <img src={url} alt={`img-${index}`} className="w-16 h-16 object-cover rounded" />
                  <span className="text-sm truncate">{url}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    Șterge
                  </Button>
                </li>
              ))}
            </ul>
          )}
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
                  <input
                    placeholder="Nume (ex: S)"
                    value={size.name}
                    onChange={(e) => {
                      const newSizes = [...sizes];
                      newSizes[index].name = e.target.value;
                      setSizes(newSizes);
                    }}
                    className="border rounded p-2"
                  />
                  <input
                    type="number"
                    placeholder="Modificator preț"
                    value={size.priceModifier}
                    onChange={(e) => {
                      const newSizes = [...sizes];
                      newSizes[index].priceModifier = Number(e.target.value);
                      setSizes(newSizes);
                    }}
                    className="border rounded p-2"
                  />
                  <input
                    type="number"
                    placeholder="Stoc"
                    value={size.stock}
                    onChange={(e) => {
                      const newSizes = [...sizes];
                      newSizes[index].stock = Number(e.target.value);
                      setSizes(newSizes);
                    }}
                    min={0}
                    className="border rounded p-2"
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
                  <input
                    placeholder="Nume culoare"
                    value={color.name}
                    onChange={(e) => {
                      const newColors = [...colors];
                      newColors[index].name = e.target.value;
                      setColors(newColors);
                    }}
                    className="border rounded p-2"
                  />
                  <input
                    type="color"
                    value={color.hexCode}
                    onChange={(e) => {
                      const newColors = [...colors];
                      newColors[index].hexCode = e.target.value;
                      setColors(newColors);
                    }}
                    className="h-10 p-1 border rounded"
                  />
                  <input
                    placeholder="URL imagine"
                    value={color.image}
                    onChange={(e) => {
                      const newColors = [...colors];
                      newColors[index].image = e.target.value;
                      setColors(newColors);
                    }}
                    className="border rounded p-2"
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
          <div className="flex gap-2">
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (categoryInput.trim()) {
                    setCategories([...categories, categoryInput.trim()]);
                    setCategoryInput("");
                  }
                }
              }}
              className="flex-1 border rounded p-2"
              placeholder="electronice, gadget-uri"
            />
            <Button
              type="button"
              onClick={() => {
                if (categoryInput.trim()) {
                  setCategories([...categories, categoryInput.trim()]);
                  setCategoryInput("");
                }
              }}
            >
              Adaugă
            </Button>
          </div>
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
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        
        <div>
          <Label>Etichete (separate prin virgulă)</Label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (tagInput.trim()) {
                    setTags([...tags, tagInput.trim()]);
                    setTagInput("");
                  }
                }
              }}
              className="flex-1 border rounded p-2"
              placeholder="redus, nou, promo"
            />
            <Button
              type="button"
              onClick={() => {
                if (tagInput.trim()) {
                  setTags([...tags, tagInput.trim()]);
                  setTagInput("");
                }
              }}
            >
              Adaugă
            </Button>
          </div>
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
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full border rounded p-2"
              min={0}
              step="0.01"
            />
          </div>
        </div>
        
        <div>
          <Label>Dimensiuni (cm)</Label>
          <div className="grid grid-cols-3 gap-2">
            <input
              placeholder="Lungime"
              value={dimensions.length}
              onChange={(e) => setDimensions({...dimensions, length: Number(e.target.value)})}
              className="border rounded p-2"
              type="number"
              min={0}
            />
            <input
              placeholder="Lățime"
              value={dimensions.width}
              onChange={(e) => setDimensions({...dimensions, width: Number(e.target.value)})}
              className="border rounded p-2"
              type="number"
              min={0}
            />
            <input
              placeholder="Înălțime"
              value={dimensions.height}
              onChange={(e) => setDimensions({...dimensions, height: Number(e.target.value)})}
              className="border rounded p-2"
              type="number"
              min={0}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Anulează
        </Button>
        <Button type="submit">Salvează modificările</Button>
      </div>
    </form>
  );
}