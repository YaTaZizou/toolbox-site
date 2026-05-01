// Loading skeleton for GIF Creator 🖼️
export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse">
      <div className="h-4 w-24 bg-gray-800 rounded mb-8" />
      <div className="h-10 w-64 bg-gray-800 rounded mb-3" />
      <div className="h-4 w-80 bg-gray-700 rounded mb-10" />
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 space-y-4">
        <div className="h-32 bg-gray-800 rounded-xl" />
        <div className="h-10 bg-gray-800 rounded-xl" />
      </div>
      <div className="h-12 bg-gray-800 rounded-xl" />
    </div>
  );
}
