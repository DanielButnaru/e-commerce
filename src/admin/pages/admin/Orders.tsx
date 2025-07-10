import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Order {
  id: string;
  name: string;
  email: string;
  address: Address;
  items: OrderItem[];
  total: number;
  createdAt: any; // poți ajusta tipul după cum folosești timestamp-ul
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...(doc.data() as Order) });
      });
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Eroare la încărcarea comenzilor:", err);
      setError("Eroare la încărcarea comenzilor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Se încarcă comenzile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Comenzi</h1>
      {orders.length === 0 ? (
        <p>Nu există comenzi încă.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border rounded p-4 mb-4 shadow">
            <h2 className="font-semibold mb-2">Comanda #{order.id}</h2>
            <p><strong>Client:</strong> {order.name} ({order.email})</p>
            <p>
              <strong>Adresă:</strong>{" "}
              {order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}
            </p>
            <p><strong>Total:</strong> {order.total} RON</p>
            <p><strong>Produse comandate:</strong></p>
            <ul className="list-disc list-inside mb-2">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} — {item.quantity} x {item.price} RON
                </li>
              ))}
            </ul>
            <p><em>Data comenzii: {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : String(order.createdAt)}</em></p>
          </div>
        ))
      )}
    </div>
  );
}
