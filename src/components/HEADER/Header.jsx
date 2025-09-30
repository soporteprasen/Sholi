import MbarraPrincipal from './Mobile/MbarraPrincipal';
import MbarraCategorizada from './Mobile/MbarraCategorizada';
import DbarraPrincipal from './Desktop/DbarraPrincipal';
import DbarraCategorizada from './Desktop/DbarraCategorizada';

export default function Header() {
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow">
      <nav role="navigation" aria-label="Navegación principal">
        {/* Móvil */}
        <div className="block md:hidden">
          <MbarraPrincipal />
          <MbarraCategorizada />
        </div>

        {/* Escritorio */}
        <div className="hidden md:block">
          <DbarraPrincipal />
          <DbarraCategorizada />
        </div>
      </nav>
    </header>
  );
}
