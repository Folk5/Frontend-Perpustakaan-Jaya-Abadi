import React, { useState, useEffect } from "react";
import '../styles/DashboardPage.css'; // Perbarui impor CSS
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Helper function untuk mendapatkan nama Rak berdasarkan ID
const getRakLabel = (rakId) => {
  switch (rakId) {
    case 1: return 'Fiksi';
    case 2: return 'Non-Fiksi';
    case 3: return 'Referensi';
    case 4: return 'Science';
    case 5: return 'Comic';
    default: return 'Lainnya';
  }
};

const BookCard = ({ book }) => {
  const isAvailable = !book.status_booking;
  const statusText = isAvailable ? "Tersedia" : "Tidak Tersedia";

  return (
    <div className="book-card">
      <div className="book-header">
        <div className="book-icon">📚</div>
        <h3>{book.nama_buku}</h3>
      </div>
      <p>Penulis: {book.author}</p>
      <p>Jenis: {book.jenis_buku}</p>
      <p>Tipe: {book.tipe_buku}</p>
      <p>Terbit: {book.tgl_terbit}</p>
      <p>Rak: {getRakLabel(book.rakbuku_id_fk)}</p>
      <p
        className={
          isAvailable ? "status available" : "status unavailable"
        }
      >
        Status: {statusText}
      </p>
      <div className="button-container">
        {isAvailable ? (
          <button className="btn btn-booking">Booking</button>
        ) : (
          <button className="btn btn-disabled" disabled>
            Tidak Tersedia
          </button>
        )}
      </div>
    </div>
  );
};

const App = () => { // Mengubah nama App menjadi DashboardPage jika Anda ingin lebih jelas di file routing
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/books");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (e) {
        setError(e.message);
        console.error("Gagal mengambil data buku:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = books.filter(book =>
      book.nama_buku.toLowerCase().includes(lowerCaseSearchTerm) ||
      book.author.toLowerCase().includes(lowerCaseSearchTerm) ||
      book.jenis_buku.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredBooks(results);
  }, [searchTerm, books]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderContent = () => {
    if (loading) {
      return <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Memuat data buku...</p>;
    }
    if (error) {
      return <p style={{ textAlign: 'center', color: 'red', fontSize: '1.2rem' }}>Error: {error}</p>;
    }
    if (filteredBooks.length === 0 && searchTerm === '') {
      return <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Belum ada buku yang tersedia.</p>;
    }
    if (filteredBooks.length === 0 && searchTerm !== '') {
      return <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Tidak ada buku yang cocok dengan pencarian Anda.</p>;
    }
    return (
      <div className="book-list">
        {filteredBooks.map((book) => (
          <BookCard key={book.buku_id} book={book} />
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <Navbar /> 

      <main className="main-content">
        <div className="welcome-container">
          <h1 className="welcome-text">
            Selamat datang di{" "}
            <span className="highlight">Perpustakaan Jaya Abadi !</span>
          </h1>
          <h1 className="daftar-buku-text">Daftar Buku</h1>
        </div>
        
        <div className="search-section">
          <div className="search-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#888"
              viewBox="0 0 16 16"
              className="search-icon"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.397h-.001l3.85 3.85a1 1 0 0 0 1.414-1.414l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
            </svg>
            <input
              type="text"
              placeholder="Cari berdasarkan judul, penulis, atau jenis buku..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {renderContent()}

      </main>

      <Footer />
    </div>
  );
};

export default App; // Atau export default DashboardPage jika Anda ingin menggunakannya sebagai nama komponen