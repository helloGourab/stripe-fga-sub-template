import { useState } from "react";
import api from "../api";

export default function BlogForm({ onBlogCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    userId: "",
    tier: "free",
  });
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/blogs", formData);
      setResponse(res.data);
      if (onBlogCreated) onBlogCreated();
    } catch (err) {
      setResponse(err.response?.data || "Error creating blog");
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm mb-6">
      <h2 className="text-xl font-bold mb-4 text-orange-600">
        Create Blog Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Body Content"
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Author User ID (Paste from User Debug)"
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        />
        <select
          className="border p-2 w-full"
          value={formData.tier}
          onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
        >
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
        </select>
        <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 w-full">
          Publish Blog
        </button>
      </form>
      {response && (
        <pre className="mt-4 p-2 bg-gray-900 text-orange-400 text-xs overflow-auto max-h-40">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
