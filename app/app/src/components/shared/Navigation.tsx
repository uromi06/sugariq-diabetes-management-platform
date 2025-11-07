import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, LogOut, Home, User } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user?.role === 'doctor' ? '/doctor' : '/patient'} className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-semibold text-gray-900">DiabetesCare</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {user?.role === 'doctor' ? (
              <Link
                to="/doctor"
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Patients</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/patient"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  to="/patient/health"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Activity className="h-5 w-5" />
                  <span className="font-medium">My Health</span>
                </Link>
              </>
            )}

            <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
