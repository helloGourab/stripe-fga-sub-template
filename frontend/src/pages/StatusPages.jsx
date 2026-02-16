import { useSearchParams, Link } from "react-router-dom";

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white border-2 border-green-500 rounded text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-2">
        Payment Successful!
      </h1>
      <p className="text-gray-600 mb-4">Stripe Session ID:</p>
      <code className="block bg-gray-100 p-2 text-xs break-all mb-4">
        {sessionId}
      </code>
      <p className="text-sm text-gray-500 mb-6 italic">
        The webhook might still be processing. Check the User Debug page to see
        if the tier updated.
      </p>
      <Link to="/user" className="text-blue-600 font-bold hover:underline">
        Go verify User Tier →
      </Link>
    </div>
  );
}

export function CancelPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white border-2 border-red-500 rounded text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-2">
        Payment Cancelled
      </h1>
      <p className="text-gray-600 mb-6">
        User closed the Stripe checkout or clicked back.
      </p>
      <Link to="/payment" className="text-blue-600 font-bold hover:underline">
        Try again
      </Link>
    </div>
  );
}
