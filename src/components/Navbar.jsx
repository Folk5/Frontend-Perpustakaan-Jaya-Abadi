import React from 'react';
// UBAH: import Link dan useNavigate
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

// Hapus userId jika tidak digunakan di sini untuk kebersihan kode
const Navbar = ({ role }) => { 
  const navigate = useNavigate();

  const handleLogout = () => {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin keluar?');
    if (isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      // UBAH: Gunakan navigate untuk konsistensi
      navigate("/");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        {/* UBAH: Gunakan Link untuk navigasi internal */}
        <Link className="navbar-brand text-white" to="/home">Perpustakaan</Link>
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
              <Link className="nav-link text-white" to="/dashboard">Beranda</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/booking">Peminjaman</Link>
            </li>
            
            {/* --- PERUBAHAN LOGIKA DI SINI --- */}

            {/* Tampilkan link Profile untuk semua role */}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/profile">Profile</Link>
            </li>

            {/* Tampilkan link Dashboard Admin HANYA jika role adalah "admin" */}

            {role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link text-warning" to="/admin">Dashboard Admin</Link>
              </li>
            )}

            {/* --- AKHIR PERUBAHAN LOGIKA --- */}

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