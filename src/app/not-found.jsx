export default function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>
      <p className="text-gray-600">La página que estás buscando no existe o fue movida.</p>
    </div>
  );
}
