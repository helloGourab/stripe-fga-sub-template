import { useState, useEffect } from "react";
import api from "../api";

export default function SpendingsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subRes, payRes] = await Promise.all([
        api.get("/payment/subscriptions"),
        api.get("/payment"),
      ]);
      setSubscriptions(subRes.data);
      setPayments(payRes.data);
    } catch (err) {
      console.error("Error fetching spending data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <header className="flex justify-between items-center mb-8 border-b pb-4 border-purple-200">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
            Financial Records
          </h1>
          <p className="text-gray-600">
            Raw DB dump for Subscriptions and Payments
          </p>
        </div>
        <button
          onClick={fetchData}
          className="bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-700"
        >
          Refresh Data
        </button>
      </header>

      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading DB records...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscriptions Column */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-purple-700 uppercase">
              Subscriptions
            </h2>
            <pre className="p-4 bg-gray-900 text-purple-400 text-xs overflow-auto h-[600px] border-l-4 border-purple-500 rounded">
              {JSON.stringify(subscriptions, null, 2)}
            </pre>
          </div>

          {/* Payments Column */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-700 uppercase">
              Payment Ledger
            </h2>
            <pre className="p-4 bg-gray-900 text-blue-400 text-xs overflow-auto h-[600px] border-l-4 border-blue-500 rounded">
              {JSON.stringify(payments, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
