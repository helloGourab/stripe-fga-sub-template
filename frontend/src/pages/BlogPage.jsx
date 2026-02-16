import BlogForm from "../components/BlogForm";
import BlogViewer from "../components/BlogViewer";

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8 border-b pb-4 border-orange-200">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
          Blog Debugger
        </h1>
        <p className="text-gray-600">Testing /api/blogs (OpenFGA & Tiers)</p>
      </header>
      <div className="grid grid-cols-1 gap-8">
        <BlogForm />
        <BlogViewer />
      </div>
    </div>
  );
}
