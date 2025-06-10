import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; // Perbarui impor CSS
import PjALogo from '../assets/PJA_Logo-removebg-preview.png';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin keluar?');

    if (isConfirmed) {
      console.log('User logged out');
      localStorage.removeItem('userToken');
      navigate('/');
    } else {
      console.log('Logout dibatalkan');
    }
  };

  return (
    <header className="header">
      <a href="#" className="logo">
        <img src={PjALogo} alt="PJA Logo" className="logo-icon" /> 
        Perpustakaan Jaya Abadi
      </a>
      <nav className="nav-menu">
        <a href="/dasboard">Beranda</a>
        <a href="/booking">Peminjaman</a>
        <a href="/profile">Profil</a>
      </nav>
      <div className="header-right">
        <button onClick={handleLogout} className="btn-logout">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-box-arrow-right"
            viewBox="0 0 16 16"
          >
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
          </svg>
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;