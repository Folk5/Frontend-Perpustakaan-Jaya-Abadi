import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import CustomNavbar from "../components/Navbar"; // Pastikan nama file dan komponen cocok
import Footer from "../components/Footer";
import "../styles/DashboardPage.css";

// Helper function untuk mengubah ID rak menjadi label yang mudah dibaca
const getRakLabel = (rakId) => {
    switch (rakId) {
        case 1: return 'Fiksi';
        case 2: return 'Non-Fiksi';
        case 3: return 'Edukasi';
        case 4: return 'Sains';
        case 5: return 'Komik';
        default: return 'Lainnya';
    }
};

// Komponen untuk menampilkan satu kartu buku
const BookCard = ({ book }) => {
    // Logika untuk menentukan ketersediaan buku
    const isAvailable = !book.status_booking;
    const statusText = isAvailable ? "Tersedia" : "Tidak Tersedia";

    // --- PENAMBAHAN: Fungsi placeholder untuk handle booking ---
    // Di sini Anda bisa menambahkan logika untuk booking, seperti request ke API
    const handleBooking = (bookId) => {
        alert(`Fungsi booking untuk buku ID: ${bookId} akan diimplementasikan.`);
        // Contoh: await api.post('/bookings', { book_id: bookId });
    };

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
                <p><strong>Tanggal Terbit:</strong> {new Date(book.tgl_terbit).toLocaleDateString('id-ID')}</p>
                <p><strong>Rak Buku:</strong> {getRakLabel(book.rakbuku_id_fk)}</p>
                <p className={`status ${isAvailable ? "available" : "unavailable"}`}>
                    <strong>Status :</strong> {statusText}
                </p>
            </div>
            <div className="button-container">
                {isAvailable ? (
                    // --- PERBAIKAN: Menambahkan onClick handler ---
                    <button className="btn btn-primary w-100" onClick={() => handleBooking(book.buku_id)}>Booking</button>
                ) : (
                    <button className="btn btn-secondary w-100" disabled>Tidak Tersedia</button>
                )}
            </div>
        </div>
    );
};

// Komponen utama untuk halaman Dashboard
const DashboardPage = () => {
    // State untuk menyimpan daftar buku master dari API
    const [books, setBooks] = useState([]);
    // State untuk menyimpan hasil filter buku yang akan ditampilkan
    const [filteredBooks, setFilteredBooks] = useState([]);
    // State untuk menangani status loading
    const [loading, setLoading] = useState(true);
    // State untuk menangani pesan error
    const [error, setError] = useState(null);
    // State untuk menyimpan input dari kolom pencarian
    const [searchTerm, setSearchTerm] = useState('');
    // State untuk menyimpan role user, diambil dari localStorage
    const [userRole, setUserRole] = useState(null);

    // useEffect untuk mengambil data buku dari API saat komponen pertama kali dimuat
    useEffect(() => {
        // Ambil juga role dari localStorage saat komponen dimuat
        const role = localStorage.getItem('role');
        setUserRole(role);

        const fetchBooks = async () => {
            try {
                // Gunakan URL API yang sesuai
                const response = await fetch("http://localhost:8080/api/books");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBooks(data); // Simpan data master
                setFilteredBooks(data); // Inisialisasi data yang akan ditampilkan
            } catch (e) {
                setError("Gagal memuat data buku. Pastikan server API berjalan.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []); // Dependency array kosong agar hanya berjalan sekali

    // useEffect untuk memfilter buku setiap kali ada perubahan pada input pencarian atau data master
    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const results = books.filter(book =>
            book.nama_buku.toLowerCase().includes(lowerCaseSearchTerm) ||
            book.author.toLowerCase().includes(lowerCaseSearchTerm) ||
            book.jenis_buku.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredBooks(results);
    }, [searchTerm, books]);

    // Handler untuk memperbarui state searchTerm saat pengguna mengetik
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Fungsi untuk merender konten utama berdasarkan state (loading, error, atau data)
    const renderContent = () => {
        if (loading) {
            return <div className="text-center w-100"><Spinner animation="border" variant="primary" /></div>;
        }
        if (error) {
            return <p className="text-danger text-center w-100">Error: {error}</p>;
        }
        if (filteredBooks.length === 0) {
            return <p className="text-center w-100">Tidak ada buku yang cocok dengan pencarian Anda.</p>;
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
            {/* --- PERBAIKAN: Melemparkan prop 'role' ke Navbar --- */}
            <CustomNavbar role={userRole} />
            
            <main className="main-content px-0">
                <div className="header-section text-center py-5">
                    <h1 className="display-4">Selamat Datang di Perpustakaan!</h1>
                    <p className="lead">Temukan buku favorit Anda di daftar kami.</p>
                </div>

                <div className="search-section mb-4">
                    <div className="input-group w-100 max-width-500 mx-auto">
                        <input
                            type="text"
                            className="form-control text-center"
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
            
            <Footer />
        </div>
    );
};

export default DashboardPage;