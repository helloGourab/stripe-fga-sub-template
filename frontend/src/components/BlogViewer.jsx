import { useState } from "react";
import api from "../api";

export default function BlogViewer() {
  const [blogId, setBlogId] = useState("");
  const [viewerUserId, setViewerUserId] = useState(""); // New state for header
  const [blogData, setBlogData] = useState(null);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${blogId}`, {
        headers: {
          // axios automatically lowercases header keys, matches backend destructuring
          userid: viewerUserId,
        },
      });
      setBlogData(res.data);
    } catch (err) {
      setBlogData(
        err.response?.data || { error: "Access Denied / Request Failed" },
      );
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-orange-600">
        Fetch Blog (With Auth Header)
      </h2>

      <div className="space-y-3 mb-4">
        <input
          className="border p-2 w-full"
          placeholder="Blog ID"
          value={blogId}
          onChange={(e) => setBlogId(e.target.value)}
        />
        <input
          className="border p-2 w-full bg-yellow-50"
          placeholder="Viewer User ID (Header: userid)"
          value={viewerUserId}
          onChange={(e) => setViewerUserId(e.target.value)}
        />
        <button
          onClick={fetchBlog}
          className="bg-gray-800 text-white px-4 py-2 rounded w-full hover:bg-black transition-colors"
        >
          Get Blog Content
        </button>
      </div>

      {blogData && (
        <div>
          <p className="text-xs font-bold text-gray-500 mb-1 uppercase">
            Response Body:
          </p>
          <pre className="p-2 bg-black text-green-400 text-xs overflow-auto border-l-4 border-orange-500">
            {JSON.stringify(blogData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
