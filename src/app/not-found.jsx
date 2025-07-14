export default function NotFound() {
  return (
    <html>
      <head>
        <title>Página no encontrada</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'sans-serif'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Página no encontrada
        </h1>
        <p style={{ color: '#666' }}>
          La página que estás buscando no existe o fue movida.
        </p>
      </body>
    </html>
  );
}
