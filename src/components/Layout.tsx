import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, User, Calendar, BarChart, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-metafit-blue shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-gray-800">METAFIT</span>
          </Link>
          
          <div className="md:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-metafit-blue-dark"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <button 
              onClick={logout}
              className="px-4 py-2 rounded-md bg-metafit-green hover:bg-metafit-green-dark text-gray-800 font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 right-0 left-0 z-50">
          <div className="container mx-auto px-4 py-2">
            <button 
              onClick={logout}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-md"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <nav className="bg-white shadow-lg border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-around">
            <Link 
              to="/dashboard" 
              className={`flex flex-col items-center py-3 px-4 ${isActive('/dashboard') ? 'text-metafit-blue-dark' : 'text-gray-600'}`}
            >
              <Home size={24} />
              <span className="text-xs mt-1">Inicio</span>
            </Link>
            
            <Link 
              to="/plan" 
              className={`flex flex-col items-center py-3 px-4 ${isActive('/plan') ? 'text-metafit-blue-dark' : 'text-gray-600'}`}
            >
              <Calendar size={24} />
              <span className="text-xs mt-1">Plan</span>
            </Link>
            
            <Link 
              to="/progress" 
              className={`flex flex-col items-center py-3 px-4 ${isActive('/progress') ? 'text-metafit-blue-dark' : 'text-gray-600'}`}
            >
              <BarChart size={24} />
              <span className="text-xs mt-1">Progreso</span>
            </Link>
            
            <Link 
              to="/profile" 
              className={`flex flex-col items-center py-3 px-4 ${isActive('/profile') ? 'text-metafit-blue-dark' : 'text-gray-600'}`}
            >
              <User size={24} />
              <span className="text-xs mt-1">Perfil</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;