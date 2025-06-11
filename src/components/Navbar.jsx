import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ role, userId }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin keluar?');
    if (isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  const contextPath = "";

  return (
    // UBAH: fixed-top menjadi sticky-top
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand text-white" href={`${contextPath}/home`}>Perpustakaan</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link text-white" href="/dashboard">Beranda</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/booking">Peminjaman</a>
            </li>
            {role === "admin" ? (
              <li className="nav-item">
                <a className="nav-link text-warning" href="/admin">Dashboard Admin</a>
              </li>
            ) : (
              <li className="nav-item">
                <a className="nav-link text-white" href="/profile">Profile</a>
              </li>
            )}
          </ul>
          <div className="btn-group">
            <button type="button" className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;