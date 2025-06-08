import React, { useState } from 'react';
import { Calendar, User, BookOpen, Clock } from 'lucide-react';
import "../styles/Booking.css";

const DaftarBookingSaya = () => {
  const [bookingData] = useState([
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      category: "Non-Fiksi",
      type: "Edukasi",
      publishedDate: "2018-12-08",
      bookingDate: "04 Jun 2025, 00:00",
      returnDate: "10 Jun 2025, 00:00",
      status: "active"
    },
    {
      id: 2,
      title: "Dune",
      author: "Frank Herbert",
      category: "Non-Fiksi",
      type: "Novel",
      publishedDate: "1965-07-02",
      bookingDate: "04 Jun 2025, 00:00",
      returnDate: "07 Jun 2025, 00:00",
      status: "overdue"
    }
  ]);

  const formatDate = (dateString) => {
    return dateString;
  };

  const getStatusClass = (status) => {
    return status === 'overdue' ? 'overdue' : 'active';
  };

  const getStatusText = (status) => {
    return status === 'overdue' ? 'BOOKING KADALUWARSA' : '';
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
          
        </div>

        {/* Booking List */}
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
      </div>
    </div>
  );
};

export default DaftarBookingSaya;