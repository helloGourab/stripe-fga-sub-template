import PaymentForm from "../components/PaymentForm";

export default function PaymentPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8 border-b pb-4 border-green-200">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
          Payment Lab
        </h1>
        <p className="text-gray-600">Triggering Stripe Checkout Sessions</p>
      </header>
      <PaymentForm />
    </div>
  );
}
