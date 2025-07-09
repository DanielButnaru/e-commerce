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
} from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";

export default function CheckoutPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Preluăm datele userului conectat din Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();

          if (data.name) setName(data.name);
          if (data.email) setEmail(data.email);
          if (data.phone) setPhone(data.phone);

          if (data.address) {
            setAddress({
              street: data.address.street || "",
              city: data.address.city || "",
              state: data.address.state || "",
              zip: data.address.zip || "",
            });
          }
        }
      } catch (error) {
        console.error("Eroare la preluarea datelor userului:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !address.street || !address.city || !address.state || !address.zip) {
      toast.error("Completează toate câmpurile");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Trebuie să fii autentificat");
        return;
      }

      const order = {
        userId: user.uid,
        name,
        email,
        phone,
        address,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), order);

      toast.success("Comandă salvată cu succes!");
      dispatch(clearCart());
      navigate("/"); // sau navigate("/thank-you");
    } catch (error) {
      console.error("Eroare la salvarea comenzii:", error);
      toast.error("A apărut o eroare. Încearcă din nou.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Finalizare comandă</h1>

      {/* Coș */}
      <div className="mb-8 space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b pb-2 text-sm"
          >
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>{(item.price * item.quantity).toFixed(2)} RON</span>
          </div>
        ))}
        <div className="text-right font-semibold">
          Total: {total.toFixed(2)} RON
        </div>
      </div>

      {/* Formular livrare */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nume */}
        <div>
          <label className="block text-sm font-medium mb-1">Nume complet</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Telefon */}
        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Adresă detaliată */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Stradă</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              autoComplete="address-line1"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Oraș</label>
            <input
              type="text"
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
              autoComplete="address-level2"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Județ / Stat</label>
            <input
              type="text"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              autoComplete="address-level1"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cod poștal</label>
            <input
              type="text"
              value={address.zip}
              onChange={(e) =>
                setAddress({ ...address, zip: e.target.value })
              }
              autoComplete="postal-code"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full text-black bg-green-400">
          Plasează comanda
        </Button>
      </form>
    </div>
  );
}

