import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearCart } from "../store/slice/cartSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  runTransaction,
  increment
} from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";

export default function CheckoutPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  console.log(cartItems);

  // Calculăm totalul corect ținând cont de prețurile actualizate
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const calculatedTotal = cartItems.reduce((sum, item) => {
      let itemPrice = item.basePrice || item.price;
      
      // Adăugăm modificatorul de preț pentru mărime, dacă există
      if (item.selectedSize && item.variants?.sizes) {
        const size = item.variants.sizes.find(s => s.id === item.selectedSize);
        if (size?.priceModifier) {
          itemPrice += size.priceModifier;
        }
      }
      
      return sum + (itemPrice * item.quantity);
    }, 0);
    
    setTotal(calculatedTotal);
  }, [cartItems]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    paymentMethod: "card", // card, cash, etc.
    notes: "",
  });

  // Preluăm datele userului conectat din Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData(prev => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: {
              street: data.address?.street || "",
              city: data.address?.city || "",
              state: data.address?.state || "",
              zip: data.address?.zip || "",
            }
          }));
        }
      } catch (error) {
        console.error("Eroare la preluarea datelor userului:", error);
      }
    };

    fetchUserData();
  }, []);

  type FormInputEvent = React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;

  const handleInputChange = (e: FormInputEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validare
  if (!formData.name || !formData.email || !formData.phone || 
      !formData.address.street || !formData.address.city || 
      !formData.address.state || !formData.address.zip) {
    toast.error("Completează toate câmpurile obligatorii");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    toast.error("Trebuie să fii autentificat pentru a plasa o comandă");
    return;
  }

  try {
    await runTransaction(db, async (transaction) => {
      // 1. Verificăm stocurile
      for (const item of cartItems) {
        if (item.selectedSize) {
          const productRef = doc(db, "products", item.id!);
          const productDoc = await transaction.get(productRef);
          
          if (!productDoc.exists()) {
            throw new Error(`Produsul ${item.name} nu a fost găsit`);
          }

          const productData = productDoc.data();
          const size = productData.variants?.sizes?.find((s: any) => s.id === item.selectedSize);
          
          if (size && size.stock < item.quantity) {
            throw new Error(`Stoc insuficient pentru ${item.name} (${size.name})`);
          }
        }
      }

      // 2. Creăm comanda (cu date curate)
      const orderData = {
        userId: user.uid,
        ...Object.fromEntries(
          Object.entries(formData).filter(([_, value]) => value !== undefined)
        ),
        address: Object.fromEntries(
          Object.entries(formData.address).filter(([_, value]) => value !== undefined)
        ),
        items: cartItems.map(item => {
          const itemData: any = {
            id: item.id,
            name: item.name,
            price: item.basePrice || item.price,
            quantity: item.quantity,
          };
          if (item.selectedSize) itemData.size = item.selectedSize;
          if (item.selectedColor) itemData.color = item.selectedColor;
          return itemData;
        }),
        total,
        status: "processing",
        createdAt: serverTimestamp(),
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);

      // 3. Actualizăm stocurile
      for (const item of cartItems) {
        const productRef = doc(db, "products", item.id!);
        const productDoc = await transaction.get(productRef);
        
        if (productDoc.exists()) {
          const updates: any = {
            stock: increment(-item.quantity),
            updatedAt: serverTimestamp(),
          };

          if (item.selectedSize) {
            updates["variants.sizes"] = productDoc.data().variants.sizes.map((s: any) => 
              s.id === item.selectedSize 
                ? { ...s, stock: s.stock - item.quantity }
                : s
            );
          }

          transaction.update(productRef, updates);
        }
      }

      return orderRef;
    });

    // Success
    toast.success("Comanda a fost plasată cu succes!");
    dispatch(clearCart());
    navigate("/order-confirmation");
    //TODO: de facut pagina de confirmare
  } catch (error) {
    console.error("Eroare la plasarea comenzii:", error);
    toast.error(error instanceof Error ? error.message : "A apărut o eroare. Încearcă din nou.");
  }
};

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Coșul tău este gol</h2>
        <Link to="/shop">
          <Button>Înapoi la magazin</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Finalizare comandă</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Detalii comandă */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Produse</h2>
          <div className="space-y-4 border rounded-lg p-4">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  {item.selectedSize && (
                    <p className="text-sm text-gray-600">Mărime: {item.selectedSize}</p>
                  )}
                  {item.selectedColor && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Culoare:</span>
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ 
                          backgroundColor: item.variants?.colors?.find(c => c.id === item.selectedColor)?.hexCode 
                        }}
                      />
                    </div>
                  )}
                  <p className="text-sm">Cantitate: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {((item.basePrice || item.price) * item.quantity).toFixed(2)} RON
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between border-t pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-bold">{total.toFixed(2)} RON</span>
            </div>
          </div>
        </div>

        {/* Formular livrare */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Detalii livrare</h2>
          <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nume complet*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telefon*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Adresă*</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Stradă și număr"
                className="w-full p-2 border rounded mb-2"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="Oraș"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  placeholder="Județ"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="address.zip"
                  value={formData.address.zip}
                  onChange={handleInputChange}
                  placeholder="Cod poștal"
                  className="p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Metodă de plată</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="card">Card bancar</option>
                <option value="cash">Ramburs la livrare</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Observații (opțional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-700">
              Finalizează comanda
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}