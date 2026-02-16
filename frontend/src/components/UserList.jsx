import { useState, useEffect } from "react";
import api from "../api";

export default function UserList({ refreshSignal }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchUserById = async (id) => {
    try {
      const res = await api.get(`/users/${id}`);
      setSelectedUser(res.data);
    } catch (err) {
      setSelectedUser({ error: "User not found" });
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };
    loadUsers();
  }, [refreshSignal]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 border rounded bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4">All Users</h2>
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex justify-between items-center border-b pb-1"
            >
              <span>{u.name}</span>
              <button
                onClick={() => fetchUserById(u._id)}
                className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
              >
                Inspect
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border rounded bg-gray-50 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Debug Detail</h2>
        {selectedUser ? (
          <pre className="p-2 bg-black text-yellow-400 text-xs overflow-auto">
            {JSON.stringify(selectedUser, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500 italic">
            Select a user to see raw response
          </p>
        )}
      </div>
    </div>
  );
}
