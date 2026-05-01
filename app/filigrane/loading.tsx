export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse">
      <div className="h-4 w-24 bg-gray-800 rounded mb-8" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-800 rounded-full" />
        <div className="h-8 w-64 bg-gray-800 rounded" />
      </div>
      <div className="h-4 w-80 bg-gray-800 rounded mb-8" />
      <div className="border-2 border-dashed border-gray-800 rounded-2xl p-10 mb-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gray-800 rounded-full" />
          <div className="h-4 w-40 bg-gray-800 rounded" />
          <div className="h-3 w-32 bg-gray-800 rounded" />
        </div>
      </div>
      <div className="h-12 w-full bg-gray-800 rounded-xl" />
    </div>
  );
}
