import React, { useState, useEffect } from "react";
import { Spinner, Modal, Button, Form, Alert } from "react-bootstrap";
import axios from 'axios';
import CustomNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/DashboardPage.css";
import { Link } from "react-router-dom"; 


const getRakLabel = (rakId) => {
    switch (rakId) {
        case 1: return 'Fiksi'; case 2: return 'Non-Fiksi'; case 3: return 'Edukasi';
        case 4: return 'Sains'; case 5: return 'Komik'; default: return 'Lainnya';
    }
};

const BookCard = ({ book, onBookClick, isBookingDisabled }) => {
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
                    <button
                        className="btn btn-primary w-100"
                        onClick={() => onBookClick(book)}
                        disabled={isBookingDisabled} 
                        title={isBookingDisabled ? "Anda memiliki pinjaman yang kadaluwarsa. Harap selesaikan terlebih dahulu." : "Booking buku ini"}
                    >
                        Booking
                    </button>
                ) : (
                    <button className="btn btn-secondary w-100" disabled>Tidak Tersedia</button>
                )}
            </div>
        </div>
    );
};

const DashboardPage = () => {
    // State yang sudah ada
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [expiredDate, setExpiredDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState(null);

    // --- PENAMBAHAN: State baru untuk denda dan modal peringatan ---
    const [hasOverdueFine, setHasOverdueFine] = useState(false);
    const [showFineModal, setShowFineModal] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);

        const fetchAllData = async () => {
            setLoading(true);
            const accountId = localStorage.getItem('accountId');
            const token = localStorage.getItem('token');

            if (!accountId || !token) {
                setError("Data pengguna tidak ditemukan. Harap login kembali.");
                setLoading(false);
                return;
            }

            try {
                const booksPromise = axios.get("http://localhost:8080/api/books", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const bookingsPromise = axios.get(`http://localhost:8080/api/booking/bookings/${accountId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const [booksResponse, bookingsResponse] = await Promise.all([booksPromise, bookingsPromise]);

                setBooks(booksResponse.data);
                setFilteredBooks(booksResponse.data);

                const userBookings = bookingsResponse.data;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const hasOverdue = userBookings.some(booking => {
                    const expiry = new Date(booking.expired_date);
                    expiry.setHours(0, 0, 0, 0);
                    return expiry < today;
                });

                setHasOverdueFine(hasOverdue);

                if (hasOverdue) {
                    setShowFineModal(true);
                }

            } catch (e) {
                setError("Gagal memuat data. Pastikan server API berjalan dan Anda sudah login.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
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
    
    const handleBookClick = (book) => { setSelectedBook(book); setExpiredDate(''); setBookingError(null); setShowModal(true); };
    const handleConfirmBooking = async () => {
        if (!expiredDate) { setBookingError("Harap pilih tanggal pengembalian."); return; }
        setBookingLoading(true); setBookingError(null);
        const accountId = localStorage.getItem('accountId');
        const token = localStorage.getItem('token');
        const payload = { bukuId: selectedBook.buku_id, accountId: parseInt(accountId, 10), expiredDate };
        try {
            await axios.post('http://localhost:8080/api/booking', payload, { headers: { 'Authorization': `Bearer ${token}` } });
            alert(`Buku "${selectedBook.nama_buku}" berhasil dibooking!`);
            const updatedBooks = books.map(b => b.buku_id === selectedBook.buku_id ? { ...b, status_booking: true } : b);
            setBooks(updatedBooks);
            setShowModal(false);
        } catch (err) {
            setBookingError(err.response?.data?.message || "Gagal melakukan booking.");
        } finally {
            setBookingLoading(false);
        }
    };
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const renderContent = () => {
        if (loading) return <div className="text-center w-100"><Spinner animation="border" variant="primary" /></div>;
        if (error) return <p className="text-danger text-center w-100">Error: {error}</p>;
        if (filteredBooks.length === 0) return <p className="text-center w-100">Tidak ada buku yang cocok.</p>;
        return (
            <div className="book-list">
                {filteredBooks.map((book) => (
                    <BookCard key={book.buku_id} book={book} onBookClick={handleBookClick} isBookingDisabled={hasOverdueFine} />
                ))}
            </div>
        );
    };
    
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 7);
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
                    
                    <div className="search-section my-4">
                        <div className="input-group w-100 max-width-500 mx-auto">
                            <input type="text" className="form-control text-center" placeholder="Cari buku..." value={searchTerm} onChange={handleSearchChange} />
                        </div>
                    </div>
                    <div className="book-list-container">{renderContent()}</div>
                </main>
                <Footer />
            </div>

            {/* Modal untuk Booking Buku (tidak berubah) */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Booking: {selectedBook?.nama_buku}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Group><Form.Label>Tanggal Pengembalian</Form.Label><Form.Control type="date" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} min={today} max={maxDateString} /></Form.Group>
                    {bookingError && <Alert variant="danger" className="mt-3">{bookingError}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
                    <Button variant="primary" onClick={handleConfirmBooking} disabled={bookingLoading}>
                        {bookingLoading ? 'Memproses...' : 'Konfirmasi Booking'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* --- PENAMBAHAN: Modal untuk Peringatan Denda/Keterlambatan --- */}
            <Modal show={showFineModal} onHide={() => setShowFineModal(false)} centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-danger">⚠️ Peringatan Keterlambatan!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-black">
                        Terdeteksi ada satu atau lebih buku yang telah melewati tanggal pengembalian.
                    </p>
                    <p className="fw-bold text-black">
                        Fitur untuk mem-booking buku baru dinonaktifkan sementara.
                    </p>
                    <p className="text-black">
                        Silakan selesaikan pinjaman Anda yang tertunda untuk bisa meminjam kembali.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFineModal(false)}>Mengerti</Button>
                    <Link to="/booking" className="btn btn-primary">
                        Lihat Daftar Booking
                    </Link>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DashboardPage;