import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../components/Footer';
import { Person, Book, Calendar, Clock, ArrowReturnLeft } from 'react-bootstrap-icons';

const LoanedBookCard = ({ loan, onReturn, returnLoadingId }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiredDate = new Date(loan.expiredDate);
    expiredDate.setHours(0, 0, 0, 0);
    const isOverdue = expiredDate < today;

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    return (
        <Card className={`mb-3 shadow-sm ${isOverdue ? 'border-danger' : ''}`}>
            <Card.Body>
                <Row>
                    <Col md={8}>
                        <Card.Title className="d-flex align-items-center"><Book className="me-2" />{loan.judul}</Card.Title>
                        <Card.Text className="mb-1 d-flex align-items-center small text-muted">
                            <Calendar className="me-2" /> Tgl Booking: {formatDate(loan.bookingDate)}
                        </Card.Text>
                        <Card.Text className={`d-flex align-items-center small ${isOverdue ? 'text-danger fw-bold' : 'text-muted'}`}>
                            <Clock className="me-2" /> Tgl Kembali: {formatDate(loan.expiredDate)}
                        </Card.Text>
                    </Col>
                    <Col md={4} className="d-flex flex-column justify-content-center align-items-md-end">
                        {isOverdue && <Badge bg="danger" className="mb-2">KADALUWARSA</Badge>}
                        <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => onReturn(loan.bookingId)}
                            disabled={returnLoadingId === loan.bookingId}
                        >
                            {returnLoadingId === loan.bookingId ? (
                                <Spinner as="span" animation="border" size="sm" />
                            ) : (
                                <><ArrowReturnLeft className="me-2" /> Kembalikan</>
                            )}
                        </Button>
                    </Col>
                </Row>

                {isOverdue && loan.denda > 0 && (
                    <div className="mt-3 p-2 border border-danger-subtle rounded bg-danger-subtle">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-danger-emphasis">Denda Keterlambatan:</span>
                            <span className="fw-bolder fs-5 text-danger">
                                Rp {loan.denda.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

const ListPinjamanAdmin = () => {
    const navigate = useNavigate();
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [returnLoadingId, setReturnLoadingId] = useState(null);

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (userRole !== 'admin') {
            alert('Anda tidak memiliki hak akses ke halaman ini.');
            navigate('/dashboard');
            return;
        }

        const fetchAllBookings = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Otentikasi gagal. Silakan login kembali.");
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get('http://localhost:8080/api/booking/all-booking', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const dataWithFines = response.data.map(user => {
                    const processedPinjaman = user.pinjaman.map(loan => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const expiredDate = new Date(loan.expiredDate);
                        expiredDate.setHours(0, 0, 0, 0);

                        let denda = 0;
                        if (expiredDate < today) {
                            const diffTime = Math.abs(today - expiredDate);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const daysToCharge = Math.min(diffDays, 7);
                            denda = daysToCharge * 30000;
                        }
                        return { ...loan, denda: denda };
                    });
                    return { ...user, pinjaman: processedPinjaman };
                });
                
                setAllBookings(dataWithFines);
                // --- AKHIR PERUBAHAN ---

            } catch (err) {
                setError("Gagal memuat data pinjaman.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllBookings();
    }, [navigate]);

    const handleReturnBook = async (bookingId) => {
        if (!window.confirm(`Apakah Anda yakin ingin mengembalikan buku dengan Booking ID: ${bookingId}?`)) return;
        setReturnLoadingId(bookingId);
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:8080/api/booking/return-book/${bookingId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Buku berhasil dikembalikan!');
            const updatedBookings = allBookings.map(user => ({
                ...user,
                pinjaman: user.pinjaman.filter(p => p.bookingId !== bookingId)
            })).filter(user => user.pinjaman.length > 0);
            setAllBookings(updatedBookings);
        } catch (err) {
            alert('Gagal mengembalikan buku.');
            console.error(err);
        } finally {
            setReturnLoadingId(null);
        }
    };


    const renderContent = () => {
        if (loading) return <div className="text-center my-5"><Spinner animation="border" /><p>Memuat data...</p></div>;
        if (error) return <Alert variant="danger">{error}</Alert>;
        if (allBookings.length === 0) return <p className="text-center text-muted">Belum ada buku yang sedang dipinjam.</p>;
        
        return allBookings.map((user) => (
            <Card key={user.memberId} className="mb-4 shadow">
                <Card.Header as="h5" className="d-flex align-items-center">
                    <Person className="me-2" /> {user.nama} (ID: {user.memberId})
                </Card.Header>
                <Card.Body>
                    {user.pinjaman.length > 0 ? (
                        user.pinjaman.map(loan => (
                            <LoanedBookCard 
                                key={loan.bookingId} 
                                loan={loan} 
                                onReturn={handleReturnBook}
                                returnLoadingId={returnLoadingId}
                            />
                        ))
                    ) : (
                        <p className="text-muted">Tidak ada pinjaman aktif untuk pengguna ini.</p>
                    )}
                </Card.Body>
            </Card>
        ));
    };

    return (
        <>
            <main className="my-4">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={10} lg={8}>
                            <div className="text-center mb-4">
                                <h1 className="text-primary">Daftar Pinjaman Aktif</h1>
                                <p className="lead text-secondary">Monitor semua buku yang sedang dipinjam oleh pengguna.</p>
                                <Link to="/admin" className="btn btn-outline-secondary">Kembali ke Dashboard Admin</Link>
                            </div>
                            {renderContent()}
                        </Col>
                    </Row>
                </Container>
            </main>
            <Footer/>
        </>
    );
};

export default ListPinjamanAdmin;