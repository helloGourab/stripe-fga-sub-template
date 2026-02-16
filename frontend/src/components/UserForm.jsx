import { useState } from "react";
import api from "../api";

export default function UserForm({ onUserCreated }) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users", formData);
      setResponse(res.data);
      onUserCreated(); // Refresh the list
    } catch (err) {
      setResponse(err.response?.data || "Error creating user");
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm mb-6">
      <h2 className="text-xl font-bold mb-4">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
      {response && (
        <pre className="mt-4 p-2 bg-gray-900 text-green-400 text-xs overflow-auto max-h-40">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
