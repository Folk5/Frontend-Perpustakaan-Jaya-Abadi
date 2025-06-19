import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import { Container, Row, Col, Card, Button, Table, InputGroup, FormControl, Badge, Spinner, Alert } from 'react-bootstrap';
import { Search, PlusCircleFill, PencilSquare, Trash3Fill, HouseDoorFill, BoxArrowRight } from 'react-bootstrap-icons';

// Komponen BukuTable tidak diubah
const BukuTable = ({ bukuList, onEdit, onDelete }) => (
    <Card className="shadow-sm">
        <Card.Header as="h5">Daftar Buku</Card.Header>
        <Card.Body>
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nama Buku</th>
              <th>Jenis</th>
              <th>Author</th>
              <th>ID Rak</th>
              <th>Tersedia</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bukuList.length > 0 ? (
              bukuList.map((buku) => (
                <tr key={buku.buku_id}>
                    <td>{buku.buku_id}</td>
                    <td>{buku.nama_buku}</td>
                    <td>{buku.jenis_buku}</td>
                    <td>{buku.author}</td>
                    <td>{buku.rakbuku_id_fk}</td>
                    <td>{`${buku.jml_tersedia} / ${buku.jumlah}`}</td>
                    <td>
                        <Badge bg={buku.jml_tersedia > 0 ? 'success' : 'danger'}>
                        {buku.jml_tersedia > 0 ? 'Tersedia' : 'Habis'}
                        </Badge>
                    </td>
                    <td>
                        <Link to={`/admin/edit-book/${buku.buku_id}`} className="btn btn-outline-warning btn-sm me-2">
                            <PencilSquare /> Edit
                        </Link>
                        <Button variant="outline-danger" size="sm" onClick={() => onDelete(buku.buku_id)}>
                            <Trash3Fill /> Hapus
                        </Button>
                    </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="text-center">Tidak ada buku yang ditemukan.</td></tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // State tidak berubah
  const [bukuList, setBukuList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBuku, setFilteredBuku] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // useEffect untuk proteksi dan fetch data tidak berubah
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole !== 'admin') {
      alert('Anda tidak memiliki hak akses ke halaman ini.');
      navigate('/dashboard');
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (!isAuthorized) return;
    const fetchBuku = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/books');
        setBukuList(response.data);
        setFilteredBuku(response.data);
        setError(null);
      } catch (err) {
        setError('Gagal mengambil data dari server. Pastikan server API berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuku();
  }, [isAuthorized]);

  // handleLogout tidak berubah
  const handleLogout = () => {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin keluar?');
    if (isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };
  
  // useEffect untuk filter tidak berubah
  useEffect(() => {
    if (!isAuthorized) return;
    const results = bukuList.filter(buku =>
      buku.nama_buku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buku.jenis_buku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buku.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBuku(results);
  }, [searchTerm, bukuList, isAuthorized]);

  // handleEdit tidak berubah
  const handleEdit = (id) => alert(`Fungsi Edit untuk buku ID: ${id} akan diimplementasikan.`);
  
  // --- PERUBAHAN UTAMA DI SINI ---
  const handleDeleteBuku = async (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus buku dengan ID: ${id}?`)) {
      try {
        // Ambil token dari localStorage untuk otorisasi
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Otorisasi gagal. Silakan login kembali.');
          return; // Hentikan fungsi jika token tidak ada
        }
        
        // Kirim request hapus dengan header otorisasi
        await axios.delete(`http://localhost:8080/api/books/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Perbarui daftar buku di UI jika berhasil
        setBukuList(bukuList.filter(buku => buku.buku_id !== id));
        alert(`Buku dengan ID: ${id} berhasil dihapus.`);
      } catch (err) {
        // Tangani error, bisa jadi karena token expired atau masalah server
        const errorMessage = err.response?.status === 403 
            ? 'Akses ditolak. Anda mungkin tidak memiliki izin.'
            : 'Gagal menghapus buku. Terjadi kesalahan pada server.';
        alert(errorMessage);
        console.error("Error deleting book:", err);
      }
    }
  };
  // --- AKHIR PERUBAHAN ---

  const renderContent = () => {
    if (loading) return <div className="text-center"><Spinner animation="border" /><p>Memuat...</p></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    return <BukuTable bukuList={filteredBuku} onEdit={handleEdit} onDelete={handleDeleteBuku} />;
  }
  
  if (!isAuthorized) {
    return null; 
  }

  return (
    <>
      <main className="my-4">
        <Container fluid className="p-4 bg-light">
          <Row className="justify-content-center mb-4">
            <Col lg={10} className="text-center">
              <h1 className="text-primary">Admin Dashboard</h1>
              <p className="lead text-secondary">Manajemen Buku Perpustakaan</p>
              <div>
                <Link to="/dashboard" className="btn btn-info me-2">
                  <HouseDoorFill className="me-2" /> Beranda
                </Link>
                <Button variant="danger" onClick={handleLogout}>
                  <BoxArrowRight className="me-2" /> Logout
                </Button>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center mb-5">
            <Col lg={10}>
              <div className="d-flex justify-content-between align-items-center mb-3">
              <Link to="/admin/list-pinjaman" className="btn btn-success">
                  List Pinjaman Semua User
                </Link>
                <Link to="/admin/add-book" className="btn btn-primary">
                    <PlusCircleFill className="me-2" /> Tambah Buku
                </Link>
              </div>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Cari buku berdasarkan nama, jenis, atau author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary"><Search /></Button>
              </InputGroup>
              {renderContent()}
            </Col>
          </Row>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboard;