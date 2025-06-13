import React, { useState, useEffect } from 'react';
import { Spinner } from "react-bootstrap";
import { Calendar, User, BookOpen, Clock } from 'lucide-react';
import CustomNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Booking.css";
import "../styles/DashboardPage.css"; // Tetap diperlukan untuk layout grid dan container

// Helper untuk label rak
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

const BookingBookCard = ({ book }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            return date.toLocaleDateString('id-ID', options);
        } catch (e) {
            return dateString;
        }
    };

    const getStatusClass = (status) => {
        return status === 'overdue' ? 'overdue' : 'active';
    };

    const getStatusText = (status) => {
        return status === 'overdue' ? 'BOOKING KADALUWARSA' : '';
    };

    return (
        <div className={`book-card ${getStatusClass(book.status)}`}>
            <div className="book-info">
                <div className="book-icon">
                    <BookOpen />
                </div>
                <div className="book-details">
                    <h3 className={`book-title ${getStatusClass(book.status) === 'overdue' ? 'red' : 'blue'}`}>
                        {book.title}
                    </h3>

                    <div className="book-meta">
                        <div className="meta-item">
                            <User />
                            <span className="meta-label">Penulis: {book.author}</span>
                        </div>

                        <div className="meta-item">
                            <BookOpen />
                            <span className="meta-label">Rak: {book.category}</span>
                        </div>

                        <div className="meta-item">
                            <BookOpen />
                            <span className="meta-label">Jenis: {book.type}</span>
                        </div>

                        <div className="meta-item">
                            <Calendar />
                            <span className="meta-label">Terbit: {formatDate(book.publishedDate)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="booking-details">
                <div className="booking-item">
                    <Calendar />
                    <span className="booking-label">Booking: {formatDate(book.bookingDate)}</span>
                </div>

                <div className="booking-row">
                    <div className="booking-item">
                        <Clock />
                        <span className={`status-text ${getStatusClass(book.status)}`}>
                            Kadaluwarsa: {formatDate(book.returnDate)}
                        </span>
                    </div>
                </div>

                {book.status === 'overdue' && (
                    <div className="status-badge">
                        <span className="overdue-badge">
                            {getStatusText(book.status)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};


const DaftarBookingSaya = () => {
    const [bookingData, setBookingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingData = async () => {
            setLoading(true);
            setError(null);

            const accountId = localStorage.getItem("accountId");

            if (!accountId) {
                setError("Account ID not found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/booking/bookings/${accountId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const processedData = data.map(book => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const expiredDate = new Date(book.expired_date);
                    expiredDate.setHours(0, 0, 0, 0);

                    const status = expiredDate < today ? 'overdue' : 'active';

                    return {
                        id: book.buku_id,
                        title: book.nama_buku,
                        author: book.author,
                        category: book.jenis_rak || getRakLabel(book.rakbuku_id_fk),
                        type: book.jenis_buku,
                        publishedDate: book.tgl_terbit,
                        bookingDate: book.booking_date,
                        returnDate: book.expired_date,
                        status: status
                    };
                });

                setBookingData(processedData);
            } catch (e) {
                console.error("Failed to fetch booking data:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Memuat daftar booking...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-5">
                    <p className="text-danger">Error: {error}</p>
                    <p>Gagal memuat daftar booking Anda. Pastikan Anda sudah login.</p>
                </div>
            );
        }

        if (bookingData.length === 0) {
            return (
                <div className="text-center py-5">
                    <p className="text-muted">Anda belum memiliki buku yang sedang dibooking.</p>
                </div>
            );
        }

        return (
            <div className="book-list">
                {bookingData.map((book) => (
                    <BookingBookCard key={book.id} book={book} />
                ))}
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            <CustomNavbar />

            <main className="main-content px-0"> {/* Perhatikan kelas main-content dan px-0 */}
                {/* Judul langsung di dalam main */}
                <h1 className="display-4 text-center py-4">Daftar Booking Saya</h1> {/* Tambahkan kelas text-center dan py-4 untuk styling */}

                <div className="book-list-container">
                    {renderContent()}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DaftarBookingSaya;