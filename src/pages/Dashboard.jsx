import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";
import Footer from "../components/Footer"; // Import komponen Footer
import "../styles/DashboardPage.css";

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
        <div className="book-card card shadow-sm rounded">
            <div className="book-header d-flex align-items-center gap-3">
                <div className="book-icon">📚</div>
                <h3>{book.nama_buku}</h3>
            </div>
            <div className="book-info">
                <p><strong>Tipe Buku:</strong> {book.tipe_buku}</p>
                <p><strong>Penulis:</strong> {book.author}</p>
                <p><strong>Jenis Buku:</strong> {book.jenis_buku}</p>
                <p><strong>Tanggal Terbit:</strong> {book.tgl_terbit}</p>
                <p><strong>Rak Buku:</strong> {getRakLabel(book.rakbuku_id_fk)}</p>
                <p className={`status ${isAvailable ? "available" : "unavailable"}`}>
                    <strong>Status Rak:</strong> {statusText}
                </p>
            </div>
            <div className="button-container">
                {isAvailable ? (
                    <button className="btn btn-primary w-100">Booking</button>
                ) : (
                    <button className="btn btn-secondary w-100" disabled>Tidak Tersedia</button>
                )}
            </div>
        </div>
    );
};

const DashboardPage = () => {
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const renderContent = () => {
        if (loading) {
            return <Spinner animation="border" variant="primary" />;
        }
        if (error) {
            return <p className="text-danger">Error: {error}</p>;
        }
        if (filteredBooks.length === 0) {
            return <p>Tidak ada buku yang ditemukan.</p>;
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
        <div className="dashboard-container">
            <CustomNavbar />
            <main className="main-content px-0">
                <div className="header-section text-center py-5">
                    <h1 className="display-4">Selamat datang di Perpustakaan Jaya Abadi!</h1>
                    <p className="lead">Temukan buku yang Anda cari di daftar kami.</p>
                </div>

                <div className="search-section mb-4">
                    <div className="input-group w-100 max-width-500 mx-auto">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Cari buku berdasarkan judul, penulis, atau jenis"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="book-list-container">
                    {renderContent()}
                </div>
            </main>

            {/* Tambahkan komponen Footer di sini, setelah main content */}
            <Footer />
        </div>
    );
};

export default DashboardPage;