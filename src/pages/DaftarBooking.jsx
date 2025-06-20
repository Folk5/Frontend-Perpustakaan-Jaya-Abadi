import React, { useState, useEffect } from 'react';
import { Spinner } from "react-bootstrap";
// Menggunakan ikon yang benar dari lucide-react
import { Calendar, User, BookOpen, Clock } from 'lucide-react'; 
import CustomNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Booking.css";
import "../styles/DashboardPage.css";
import axios from 'axios'; // Import axios untuk request API yang lebih baik

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
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const isOverdue = book.status === 'overdue';

    return (
        <div className={`book-card ${isOverdue ? 'overdue' : 'active'}`}>
            <div className="book-info">
                <div className="book-icon"><BookOpen /></div>
                <div className="book-details">
                    <h3 className={`book-title ${isOverdue ? 'red' : 'blue'}`}>{book.title}</h3>
                    <div className="book-meta">
                        <div className="meta-item"><User /><span className="meta-label">Penulis: {book.author}</span></div>
                        <div className="meta-item"><BookOpen /><span className="meta-label">Rak: {book.category}</span></div>
                        <div className="meta-item"><BookOpen /><span className="meta-label">Jenis: {book.type}</span></div>
                        <div className="meta-item"><Calendar /><span className="meta-label">Terbit: {formatDate(book.publishedDate)}</span></div>
                    </div>
                </div>
            </div>

            <div className="booking-details">
                <div className="booking-item"><Calendar /><span className="booking-label">Booking: {formatDate(book.bookingDate)}</span></div>
                <div className="booking-row">
                    <div className="booking-item">
                        <Clock /><span className={`status-text ${isOverdue ? 'overdue' : 'active'}`}>Kadaluwarsa: {formatDate(book.returnDate)}</span>
                    </div>
                </div>

                {/* --- PENAMBAHAN BAGIAN DENDA --- */}
                {/* Tampilkan hanya jika buku telat dan ada denda */}
                {isOverdue && book.denda > 0 && (
                    <div className="fine-details">
                        <span className="fine-label">Denda Keterlambatan:</span>
                        <span className="fine-amount">
                            Rp {book.denda.toLocaleString('id-ID')}
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
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);

        const fetchBookingData = async () => {
            setLoading(true);
            setError(null);

            const accountId = localStorage.getItem("accountId");

            if (!accountId) {
                setError("Account ID tidak ditemukan. Harap login.");
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/booking/bookings/${accountId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = response.data;

                const processedData = data.map(book => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const expiredDate = new Date(book.expired_date);
                    expiredDate.setHours(0, 0, 0, 0);

                    const status = expiredDate < today ? 'overdue' : 'active';
                    let denda = 0;

                    if (status === 'overdue') {
                        // Hitung selisih hari
                        const diffTime = Math.abs(today - expiredDate);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        const daysToCharge = Math.min(diffDays, 7);
                        
                        denda = daysToCharge * 30000;
                    }

                    return {
                        id: book.buku_id,
                        title: book.nama_buku,
                        author: book.author,
                        category: book.jenis_rak || getRakLabel(book.rakbuku_id_fk),
                        type: book.jenis_buku,
                        publishedDate: book.tgl_terbit,
                        bookingDate: book.booking_date,
                        returnDate: book.expired_date,
                        status: status,
                        denda: denda 
                    };
                });

                setBookingData(processedData);
            } catch (e) {
                console.error("Failed to fetch booking data:", e);
                setError(e.response?.data?.message || e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <div className="text-center py-5"><Spinner animation="border" variant="primary" /><p className="mt-3">Memuat...</p></div>;
        }
        if (error) {
            return <div className="text-center py-5"><p className="text-danger">Error: {error}</p></div>;
        }
        if (bookingData.length === 0) {
            return <div className="text-center py-5"><p className="text-muted">Anda belum memiliki buku yang dibooking.</p></div>;
        }
        return <div className="book-list">{bookingData.map((book) => <BookingBookCard key={book.id} book={book} />)}</div>;
    };

    return (
        <div className="dashboard-container">
            <CustomNavbar role={userRole}/>
            <main className="main-content px-0">
                <h1 className="display-4 text-center py-4">Daftar Booking Saya</h1>
                <div className="book-list-container">{renderContent()}</div>
            </main>
            <Footer />
        </div>
    );
};

export default DaftarBookingSaya;