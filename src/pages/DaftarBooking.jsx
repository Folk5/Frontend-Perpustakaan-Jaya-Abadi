import React, { useState, useEffect } from 'react';
import { Calendar, User, BookOpen, Clock } from 'lucide-react';
import "../styles/Booking.css";
import { Spinner } from "react-bootstrap"; // Import Spinner untuk indikator loading

const DaftarBookingSaya = () => {
  const [bookingData, setBookingData] = useState([]); // Ubah ini menjadi state kosong
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null);   // State untuk error

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

  const formatDate = (dateString) => {
    // Pastikan format dateString sesuai dengan yang Anda inginkan
    // Jika dari API datang dalam format YYYY-MM-DD, Anda bisa memformatnya
    try {
      const date = new Date(dateString);
      // Contoh format menjadi 'DD Mon YYYY, HH:MM'
      const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
      return date.toLocaleDateString('id-ID', options); // 'id-ID' untuk format Indonesia
    } catch (e) {
      return dateString; // Fallback jika format tidak valid
    }
  };

  const getStatusClass = (status) => {
    // Logika status sekarang akan didasarkan pada perbandingan tanggal
    return status === 'overdue' ? 'overdue' : 'active';
  };

  const getStatusText = (status) => {
    return status === 'overdue' ? 'BOOKING KADALUWARSA' : '';
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      setLoading(true);
      setError(null);

      // Ambil accountId dari localStorage
      const accountId = localStorage.getItem("accountId"); // Pastikan 'accountId' disimpan di localStorage saat login

      if (!accountId) {
        setError("Account ID not found in localStorage. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/booking/bookings/${accountId}`);
        
        if (!response.ok) {
          // Tangani error HTTP (misal: 404 Not Found, 500 Internal Server Error)
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Memproses data dari API agar sesuai dengan struktur yang diharapkan
        const processedData = data.map(book => {
          // Membandingkan tanggal kedaluwarsa dengan tanggal saat ini untuk menentukan status
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Atur jam ke awal hari untuk perbandingan yang akurat
          const expiredDate = new Date(book.expired_date);
          expiredDate.setHours(0, 0, 0, 0); // Atur jam ke awal hari

          const status = expiredDate < today ? 'overdue' : 'active';

          return {
            id: book.buku_id, // Menggunakan buku_id sebagai id unik
            title: book.nama_buku,
            author: book.author,
            category: book.jenis_rak, // Menggunakan jenis_rak dari API
            type: book.jenis_buku, // Menggunakan jenis_buku dari API
            publishedDate: book.tgl_terbit,
            bookingDate: book.booking_date,
            returnDate: book.expired_date, // Menggunakan expired_date sebagai returnDate
            status: status // Status dinamis berdasarkan tanggal
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
  }, []); // [] agar useEffect hanya berjalan sekali saat komponen mount

  // Render konten berdasarkan status loading/error
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Memuat data booking...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-5">
          <p className="text-danger">Error: {error}</p>
          <p>Gagal memuat daftar booking. Coba lagi nanti.</p>
        </div>
      );
    }

    if (bookingData.length === 0) {
      return (
        <div className="text-center py-5">
          <p className="text-muted">Anda belum memiliki booking buku.</p>
        </div>
      );
    }

    return (
      <div className="booking-list">
        {bookingData.map((book) => (
          <div
            key={book.id}
            className={`book-card ${getStatusClass(book.status)}`}
          >
            {/* Book Info */}
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
                    <span className="meta-label">Terbit: {book.publishedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
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
        ))}
      </div>
    );
  };

  return (
    <div className="booking-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">
          Daftar Booking Saya
        </h1>
        <p className="header-subtitle">
          Selamat datang kembali di Perpustakaan Jaya Abadi
        </p>
      </div>

      <div className="card-container">
        {/* Navigation Header */}
        <div className="nav-header">
          <div className="nav-icon-container">
            <div className="nav-icon">
              <BookOpen />
            </div>
          </div>
          {/* Anda bisa menambahkan elemen lain di nav-header jika diperlukan */}
        </div>

        {/* Render konten dinamis */}
        {renderContent()}
      </div>
    </div>
  );
};

export default DaftarBookingSaya;