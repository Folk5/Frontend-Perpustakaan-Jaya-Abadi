import React from 'react';
import '../styles/Footer.css'; // Perbarui impor CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Perpustakaan Jaya Abadi. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Syarat dan Ketentuan</a>
          <a href="#">Kontak Kami</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;