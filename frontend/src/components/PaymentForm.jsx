import { useState } from "react";
import api from "../api";

export default function PaymentForm() {
  const [userId, setUserId] = useState("");
  const [tier, setTier] = useState("basic");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await api.post("/payment/checkout", { userId, tier });
      // Redirect to Stripe's hosted page
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      alert("Checkout failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm mb-6">
      <h2 className="text-xl font-bold mb-4 text-green-600">
        Upgrade Subscription
      </h2>
      <div className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="User ID to upgrade"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <select
          className="border p-2 w-full"
          value={tier}
          onChange={(e) => setTier(e.target.value)}
        >
          <option value="basic">Basic Plan</option>
          <option value="pro">Pro Plan</option>
        </select>
        <button
          onClick={handleCheckout}
          disabled={loading || !userId}
          className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Redirecting..." : "Buy Subscription"}
        </button>
      </div>
    </div>
  );
}
