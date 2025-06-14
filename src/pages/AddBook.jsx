import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import Footer from '../components/Footer';

const AddBook = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_buku: '',
    tipe_buku: 'fisik',
    jenis_buku: '',
    tgl_terbit: '',
    author: '',
    rakbuku_id_fk: '',
    jumlah: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // --- PENAMBAHAN: Definisikan pilihan rak secara statis di sini ---
  const rakOptions = [
    { id: 1, label: 'Fiksi' },
    { id: 2, label: 'Non-Fiksi' },
    { id: 3, label: 'Edukasi' },
    { id: 4, label: 'Sains' },
    { id: 5, label: 'Komik' },
    // Anda bisa menambahkan opsi "Lainnya" jika diperlukan, misal dengan ID 0 atau 99
    // { id: 99, label: 'Lainnya' }, 
  ];
  // --- AKHIR PENAMBAHAN ---

  // Efek untuk proteksi halaman
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole !== 'admin') {
      alert('Anda tidak memiliki hak akses ke halaman ini.');
      navigate('/dashboard');
    } else {
      setIsAuthorized(true);
    }
    // HAPUS: Logika fetch data rak dari API sudah tidak diperlukan lagi
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
        setError("Token tidak ditemukan. Harap login kembali.");
        setLoading(false);
        return;
    }

    const payload = {
      nama_buku: formData.nama_buku,
      tipe_buku: formData.tipe_buku,
      jenis_buku: formData.jenis_buku,
      tgl_terbit: formData.tgl_terbit,
      author: formData.author,
      rakbuku_id_fk: parseInt(formData.rakbuku_id_fk, 10),
      jumlah: parseInt(formData.jumlah, 10),
    };

    try {
      await axios.post('http://localhost:8080/api/books', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      alert('Buku berhasil ditambahkan!');
      navigate('/admin');
    } catch (err) {
      console.error('Error adding book:', err.response ? err.response.data : err.message);
      setError('Gagal menambahkan buku. Periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <main className="my-5">
        <Container style={{ maxWidth: '700px' }}>
          <Card className="p-4 shadow">
            <h3 className="text-center text-primary mb-4">Tambah Buku Baru</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              {/* ... Input form lainnya tidak berubah ... */}
              <Form.Group className="mb-3">
                <Form.Label>Nama Buku</Form.Label>
                <Form.Control type="text" name="nama_buku" required placeholder="Masukkan nama buku" value={formData.nama_buku} onChange={handleChange} />
              </Form.Group>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Tipe Buku</Form.Label><Form.Select name="tipe_buku" required value={formData.tipe_buku} onChange={handleChange}><option value="fisik">Fisik</option><option value="online">Online</option></Form.Select></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Jenis Buku</Form.Label><Form.Control type="text" name="jenis_buku" required placeholder="Contoh: Novel, Komik" value={formData.jenis_buku} onChange={handleChange} /></Form.Group></Col>
              </Row>
              <Form.Group className="mb-3"><Form.Label>Penulis</Form.Label><Form.Control type="text" name="author" required placeholder="Masukkan nama penulis" value={formData.author} onChange={handleChange} /></Form.Group>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Tanggal Terbit</Form.Label><Form.Control type="date" name="tgl_terbit" required value={formData.tgl_terbit} onChange={handleChange} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Jumlah</Form.Label><Form.Control type="number" name="jumlah" required min="1" placeholder="Jumlah buku" value={formData.jumlah} onChange={handleChange} /></Form.Group></Col>
              </Row>

              {/* --- DROPDOWN RAK BUKU MENGGUNAKAN DATA STATIS --- */}
              <Form.Group className="mb-4">
                <Form.Label>Rak Buku</Form.Label>
                <Form.Select name="rakbuku_id_fk" required value={formData.rakbuku_id_fk} onChange={handleChange}>
                  <option value="">Pilih Rak Buku</option>
                  {/* Mapping dari array statis 'rakOptions' */}
                  {rakOptions.map((rak) => (
                    <option key={rak.id} value={rak.id}>
                      {rak.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? <><Spinner as="span" animation="border" size="sm" /> Menambahkan...</> : 'Tambah Buku'}
                </Button>
                <Link to="/admin" className="btn btn-secondary">Kembali</Link>
              </div>
            </Form>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default AddBook;