import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer'; // Sesuaikan path jika perlu
import { Container, Row, Col, Card, Button, Table, InputGroup, FormControl, Badge, Spinner, Alert } from 'react-bootstrap';
import { Search, PlusCircleFill, PencilSquare, Trash3Fill, HouseDoorFill, BoxArrowRight } from 'react-bootstrap-icons';

// Komponen BukuTable tidak perlu diubah
const BukuTable = ({ bukuList, onEdit, onDelete }) => (
    <Card className="shadow-sm">
        {/* ... isi komponen table ... */}
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
                        <Button variant="outline-warning" size="sm" className="me-2" onClick={() => onEdit(buku.buku_id)}>
                            <PencilSquare /> Edit
                        </Button>
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
  
  // State lainnya
  const [bukuList, setBukuList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBuku, setFilteredBuku] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- UBAH: LOGIKA PROTEKSI HALAMAN ---
  // State untuk menandai apakah user berhak akses
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Periksa role dari localStorage saat komponen dimuat
    const userRole = localStorage.getItem('role');

    if (userRole !== 'admin') {
      // 2. Jika bukan admin, tampilkan alert dan redirect
      alert('Anda tidak memiliki hak akses ke halaman ini.');
      navigate('/dashboard'); // Alihkan ke beranda user
    } else {
      // 3. Jika admin, izinkan komponen untuk dirender dan memuat data
      setIsAuthorized(true);
    }
  }, [navigate]);

  // useEffect untuk fetch data HANYA jika sudah terotorisasi
  useEffect(() => {
    // Jangan fetch data jika pengguna tidak berhak
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
  }, [isAuthorized]); // Bergantung pada status otorisasi

  // ... (Sisa logika lain tidak berubah)
  const handleLogout = () => {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin keluar?');
    if (isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };
  
  useEffect(() => {
    if (!isAuthorized) return;
    const results = bukuList.filter(buku =>
      buku.nama_buku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buku.jenis_buku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buku.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBuku(results);
  }, [searchTerm, bukuList, isAuthorized]);

  const handleAddBuku = () => alert('Fungsi Tambah Buku akan diimplementasikan.');
  const handleEdit = (id) => alert(`Fungsi Edit untuk buku ID: ${id} akan diimplementasikan.`);
  const handleDeleteBuku = async (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus buku dengan ID: ${id}?`)) {
        try {
          await axios.delete(`http://localhost:8080/api/books/${id}`);
          setBukuList(bukuList.filter(buku => buku.buku_id !== id));
          alert(`Buku dengan ID: ${id} berhasil dihapus.`);
        } catch (err) {
          alert('Gagal menghapus buku. Terjadi kesalahan pada server.');
          console.error(err);
        }
      }
  };

  const renderContent = () => {
    if (loading) return <div className="text-center"><Spinner animation="border" /><p>Memuat...</p></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    return <BukuTable bukuList={filteredBuku} onEdit={handleEdit} onDelete={handleDeleteBuku} />;
  }
  
  // --- UBAH: JANGAN RENDER APAPUN JIKA TIDAK BERHAK ---
  // Ini mencegah "flash" atau kedipan konten sebelum redirect
  if (!isAuthorized) {
    return null; 
  }

  // Jika lolos pengecekan, render seluruh halaman
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
                <Button variant="success">List Pinjaman</Button>
                <Button variant="primary" onClick={handleAddBuku}>
                  <PlusCircleFill className="me-2" /> Tambah Buku
                </Button>
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