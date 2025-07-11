import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
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
  phone?: string;
  address: Address;
  items: OrderItem[];
  total: number;
  status?: string;
  createdAt: any;
  paymentMethod?: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedOrders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
        } as Order);
      });
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Eroare la încărcarea comenzilor:", err);
      setError("Eroare la încărcarea comenzilor");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (order: Order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text(`Factură Comandă #${order.id}`, 14, 20);
    doc.setFontSize(12);
    doc.text(
      `Data: ${
        order.createdAt?.toLocaleDateString?.() ||
        new Date().toLocaleDateString()
      }`,
      14,
      30
    );

    // Client info
    doc.setFontSize(14);
    doc.text("Date Client:", 14, 45);
    doc.setFontSize(12);
    doc.text(`Nume: ${order.name}`, 14, 55);
    doc.text(`Email: ${order.email}`, 14, 65);
    if (order.phone) doc.text(`Telefon: ${order.phone}`, 14, 75);

    // Adresă
    doc.text(
      `Adresă: ${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.zip}`,
      14,
      85
    );

    // Produse
    doc.setFontSize(14);
    doc.text("Produse Comandate:", 14, 100);

    const itemsData = order.items.map((item) => [
      item.name,
      item.quantity,
      `${item.price} RON`,
      `${(item.price * item.quantity).toFixed(2)} RON`,
      item.size || "-",
      item.color || "-",
    ]);

    autoTable(doc, {
      startY: 105,
      head: [["Produs", "Cantitate", "Preț", "Total", "Mărime", "Culoare"]],
      body: itemsData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total Comandă: ${order.total.toFixed(2)} RON`, 14, finalY);

    if (order.paymentMethod) {
      doc.text(
        `Metodă Plată: ${
          order.paymentMethod === "card" ? "Card bancar" : "Ramburs"
        }`,
        14,
        finalY + 10
      );
    }

    if (order.status) {
      doc.text(`Status: ${order.status}`, 14, finalY + 20);
    }

    // Salvare PDF
    doc.save(`comanda_${order.id}.pdf`);
  };

  const generateAllOrdersPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text(`Raport Comenzi`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Generat la: ${new Date().toLocaleDateString()}`, 14, 30);

    let yPosition = 40;

    orders.forEach((order, index) => {
      if (index > 0) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text(`Comanda #${order.id}`, 14, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.text(`Client: ${order.name} (${order.email})`, 14, yPosition);
      yPosition += 10;
      doc.text(
        `Data: ${order.createdAt?.toLocaleDateString?.() || "N/A"}`,
        14,
        yPosition
      );
      yPosition += 10;
      doc.text(`Total: ${order.total.toFixed(2)} RON`, 14, yPosition);
      yPosition += 15;

      // Tabel produse
      const itemsData = order.items.map((item) => [
        item.name,
        item.quantity,
        `${item.price} RON`,
        `${(item.price * item.quantity).toFixed(2)} RON`,
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [["Produs", "Cantitate", "Preț", "Total"]],
        body: itemsData,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      })
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    });

    doc.save(`rapoarte_comenzi_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <div className="p-4 text-center">Se încarcă comenzile...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Comenzi</h1>
        {orders.length > 0 && (
          <button
            onClick={generateAllOrdersPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Exportă toate comenzile (PDF)
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">Nu există comenzi încă.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">
                      Comanda #{order.id}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {order.createdAt?.toLocaleDateString?.() ||
                        "Data necunoscută"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {order.total.toFixed(2)} RON
                    </p>
                    {order.status && (
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-b">
                <h3 className="font-medium mb-2">Client</h3>
                <p>{order.name}</p>
                <p className="text-gray-600">{order.email}</p>
                {order.phone && <p className="text-gray-600">{order.phone}</p>}
              </div>

              <div className="p-4 border-b">
                <h3 className="font-medium mb-2">Adresă livrare</h3>
                <p>
                  {order.address.street}, {order.address.city},{" "}
                  {order.address.state} {order.address.zip}
                </p>
              </div>

              <div className="p-4 border-b">
                <h3 className="font-medium mb-2">
                  Produse ({order.items.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Produs
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Mărime
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Culoare
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Cantitate
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Preț
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <tr key={`${order.id}-${item.id}`}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {item.size || "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {item.color || "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {item.price.toFixed(2)} RON
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {(item.price * item.quantity).toFixed(2)} RON
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 flex justify-between items-center">
                <div>
                  {order.paymentMethod && (
                    <p className="text-gray-600">
                      Metodă plată:{" "}
                      {order.paymentMethod === "card"
                        ? "Card bancar"
                        : "Ramburs"}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => generatePDF(order)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Descarcă factură (PDF)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
