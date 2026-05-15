import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <Link className="navbar-brand fw-bold tracking-wider text-warning" to="/">
        NEXUS<span className="text-white">MART</span>
      </Link>
      
      <div className="d-flex ms-auto align-items-center">
        <Link className="nav-link text-light me-3" to="/">Catalog</Link>
        <Link className="nav-link text-light me-4" to="/cart">Cart 🛒</Link>

        {user ? (
          <div className="d-flex align-items-center">
            {user.isAdmin && (
              <Link className="btn btn-sm btn-outline-warning me-3" to="/admin/add-product">
                + Add Product (Admin)
              </Link>
            )}
            <span className="text-light me-3 d-none d-md-inline">
              Hi, <strong className="text-info">{user.name}</strong>
            </span>
            <button onClick={handleLogout} className="btn btn-sm btn-danger">
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link className="btn btn-sm btn-outline-light me-2" to="/login">Login</Link>
            <Link className="btn btn-sm btn-warning text-dark fw-medium" to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;