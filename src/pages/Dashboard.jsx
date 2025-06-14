import React, { useState, useEffect } from "react";
// PENAMBAHAN: Import komponen Modal, Button, Form, dan Spinner dari react-bootstrap
import { Spinner, Modal, Button, Form, Alert } from "react-bootstrap";
import axios from 'axios'; // Gunakan axios untuk request API
import CustomNavbar from "../components/Navbar";
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
// UBAH: Komponen ini sekarang menerima prop onBookClick dari parent
const BookCard = ({ book, onBookClick }) => {
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
                <p><strong>Tanggal Terbit:</strong> {new Date(book.tgl_terbit).toLocaleDateString('id-ID')}</p>
                <p><strong>Rak Buku:</strong> {getRakLabel(book.rakbuku_id_fk)}</p>
                <p className={`status ${isAvailable ? "available" : "unavailable"}`}>
                    <strong>Status :</strong> {statusText}
                </p>
            </div>
            <div className="button-container">
                {isAvailable ? (
                    // UBAH: onClick sekarang memanggil fungsi dari prop
                    <button className="btn btn-primary w-100" onClick={() => onBookClick(book)}>Booking</button>
                ) : (
                    <button className="btn btn-secondary w-100" disabled>Tidak Tersedia</button>
                )}
            </div>
        </div>
    );
};

// Komponen utama untuk halaman Dashboard
const DashboardPage = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [userRole, setUserRole] = useState(null);

    // --- PENAMBAHAN: State untuk Modal dan proses booking ---
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [expiredDate, setExpiredDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    // --- AKHIR PENAMBAHAN ---

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
        const fetchBooks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/books");
                setBooks(response.data);
                setFilteredBooks(response.data);
            } catch (e) {
                setError("Gagal memuat data buku. Pastikan server API berjalan.");
                console.error(e);
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

    // --- PENAMBAHAN: Fungsi untuk menangani alur booking ---
    const handleBookClick = (book) => {
        setSelectedBook(book); // Simpan buku yang dipilih
        setExpiredDate(''); // Reset tanggal setiap kali modal dibuka
        setBookingError(null); // Reset error
        setShowModal(true); // Tampilkan modal
    };

    const handleConfirmBooking = async () => {
        if (!expiredDate) {
            setBookingError("Harap pilih tanggal pengembalian.");
            return;
        }

        setBookingLoading(true);
        setBookingError(null);

        const accountId = localStorage.getItem('accountId');
        const token = localStorage.getItem('token');

        if (!accountId || !token) {
            setBookingError("Data pengguna tidak ditemukan. Harap login kembali.");
            setBookingLoading(false);
            return;
        }

        const payload = {
            bukuId: selectedBook.buku_id,
            accountId: parseInt(accountId, 10),
            expiredDate: expiredDate,
        };

        try {
            await axios.post('http://localhost:8080/api/booking', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(`Buku "${selectedBook.nama_buku}" berhasil dibooking!`);
            
            // Perbarui status buku di UI secara instan
            const updatedBooks = books.map(b => 
                b.buku_id === selectedBook.buku_id ? { ...b, status_booking: true } : b
            );
            setBooks(updatedBooks);

            setShowModal(false);
        } catch (err) {
            setBookingError(err.response?.data?.message || "Gagal melakukan booking.");
            console.error(err);
        } finally {
            setBookingLoading(false);
        }
    };

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const renderContent = () => {
        if (loading) return <div className="text-center w-100"><Spinner animation="border" variant="primary" /></div>;
        if (error) return <p className="text-danger text-center w-100">Error: {error}</p>;
        if (filteredBooks.length === 0) return <p className="text-center w-100">Tidak ada buku yang cocok dengan pencarian Anda.</p>;
        return (
            <div className="book-list">
                {filteredBooks.map((book) => (
                    // Berikan fungsi handleBookClick sebagai prop
                    <BookCard key={book.buku_id} book={book} onBookClick={handleBookClick} />
                ))}
            </div>
        );
    };
    
    // --- PENAMBAHAN: Logika untuk batas tanggal min dan max ---
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7); // Batas booking maksimal 7 hari dari sekarang
    const maxDateString = maxDate.toISOString().split('T')[0];

    return (
        <>
            <div className="dashboard-container">
                <CustomNavbar role={userRole} />
                <main className="main-content px-0">
                    <div className="header-section text-center py-5">
                        <h1 className="display-4">Selamat Datang di Perpustakaan!</h1>
                        <p className="lead">Temukan buku favorit Anda di daftar kami.</p>
                    </div>
                    <div className="search-section mb-4">
                        <div className="input-group w-100 max-width-500 mx-auto">
                            <input type="text" className="form-control text-center" placeholder="Cari buku..." value={searchTerm} onChange={handleSearchChange} />
                        </div>
                    </div>
                    <div className="book-list-container">{renderContent()}</div>
                </main>
                <Footer />
            </div>

            {/* --- PENAMBAHAN: Komponen Modal untuk Kalender Booking --- */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Booking Buku: {selectedBook?.nama_buku}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Silakan pilih tanggal pengembalian buku.</p>
                    <Form.Group>
                        <Form.Label>Tanggal Pengembalian (Expired Date)</Form.Label>
                        <Form.Control 
                            type="date" 
                            value={expiredDate} 
                            onChange={(e) => setExpiredDate(e.target.value)}
                            min={today} // Tidak bisa memilih tanggal kemarin
                            max={maxDateString} // Batas maksimal peminjaman
                        />
                    </Form.Group>
                    {bookingError && <Alert variant="danger" className="mt-3">{bookingError}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
                    <Button variant="primary" onClick={handleConfirmBooking} disabled={bookingLoading}>
                        {bookingLoading ? <><Spinner as="span" size="sm" /> Memproses...</> : 'Konfirmasi Booking'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DashboardPage;