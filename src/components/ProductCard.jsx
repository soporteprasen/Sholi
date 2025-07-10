export default function ProductCard({ producto }) {
  return (
    <div className="bg-white shadow-md rounded overflow-hidden hover:shadow-xl transition">
      <img src={producto.imagen} alt={producto.nombre} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg">{producto.nombre}</h3>
        <p className="text-indigo-600 font-semibold">{producto.precio}</p>
        <button className="mt-3 w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition">
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}