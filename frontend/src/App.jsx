import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserPage from "./pages/UserPage";
import BlogPage from "./pages/BlogPage";
import PaymentPage from "./pages/PaymentPage";
import SpendingsPage from "./pages/SpendingsPage"; // New Import
import { SuccessPage, CancelPage } from "./pages/StatusPages";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white border-b p-4 flex gap-6 shadow-sm overflow-x-auto whitespace-nowrap">
          <Link to="/" className="font-bold text-gray-400">
            Home
          </Link>
          <Link to="/user" className="font-bold text-blue-600">
            Users
          </Link>
          <Link to="/payment" className="font-bold text-green-600">
            Payments
          </Link>
          <Link to="/spendings" className="font-bold text-purple-600">
            Spendings (DB)
          </Link>
          <Link to="/blog" className="font-bold text-orange-600">
            Blogs (FGA)
          </Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="p-10 text-center text-gray-400">
                Select a module above
              </div>
            }
          />
          <Route path="/user" element={<UserPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/spendings" element={<SpendingsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
