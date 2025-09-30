// components/ProductoSkeleton.jsx
export default function ProductoSkeleton() {
  return (
    <div className="animate-pulse p-4 border rounded-md shadow-sm bg-white">
      <div className="bg-gray-300 h-40 w-full mb-4 rounded-md" />
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
