import { useState } from "react";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

export default function UserPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
          User Management
        </h1>
        <p className="text-gray-600">Testing /api/users endpoints</p>
      </header>

      <main>
        <UserForm onUserCreated={() => setRefresh((prev) => prev + 1)} />
        <UserList refreshSignal={refresh} />
      </main>
    </div>
  );
}
