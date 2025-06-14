import React, { useState, useEffect } from 'react';
// PENAMBAHAN: import useParams untuk mengambil ID dari URL
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import Footer from '../components/Footer';

const EditBook = () => {
  // PENAMBAHAN: Dapatkan ID buku dari parameter URL
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_buku: '',
    tipe_buku: '',
    jenis_buku: '',
    tgl_terbit: '',
    author: '',
    rakbuku_id_fk: '',
    jumlah: '',
  });

  const [rakOptions, setRakOptions] = useState([]);
  const [loading, setLoading] = useState(true); // Set true karena kita akan fetch data awal
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // State loading khusus untuk tombol submit

  // Daftar rak statis
  const staticRakOptions = [
    { id: 1, label: 'Fiksi' },
    { id: 2, label: 'Non-Fiksi' },
    { id: 3, label: 'Edukasi' },
    { id: 4, label: 'Sains' },
    { id: 5, label: 'Komik' },
  ];

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole !== 'admin') {
      alert('Anda tidak memiliki hak akses ke halaman ini.');
      navigate('/dashboard');
      return;
    }
    setIsAuthorized(true);

    // Fungsi untuk mengambil data buku yang akan diedit
    const fetchBookData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/books/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const book = response.data;
        
        // Format tanggal agar sesuai dengan input type="date" (YYYY-MM-DD)
        const formattedDate = book.tgl_terbit ? book.tgl_terbit.split('T')[0] : '';

        // Isi form dengan data yang ada
        setFormData({
          nama_buku: book.nama_buku,
          tipe_buku: book.tipe_buku,
          jenis_buku: book.jenis_buku,
          tgl_terbit: formattedDate,
          author: book.author,
          rakbuku_id_fk: book.rakbuku_id_fk,
          jumlah: book.jumlah,
        });
      } catch (err) {
        setError("Gagal memuat data buku. Mungkin buku tidak ditemukan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // UBAH: Fungsi submit untuk UPDATE (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    const token = localStorage.getItem('token');
    const payload = {
      ...formData,
      rakbuku_id_fk: parseInt(formData.rakbuku_id_fk, 10),
      jumlah: parseInt(formData.jumlah, 10),
    };

    try {
      await axios.put(`http://localhost:8080/api/books/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Buku berhasil diperbarui!');
      navigate('/admin');
    } catch (err) {
      setError('Gagal memperbarui buku. Periksa kembali data Anda.');
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };
  
  // Tampilkan loading saat data awal sedang diambil
  if (loading) {
    return <div className="text-center my-5"><Spinner animation="border" /><p>Memuat data buku...</p></div>;
  }

  // Jangan render form jika tidak berhak atau ada error fatal
  if (!isAuthorized || error) {
    return <div className="text-center my-5"><Alert variant="danger">{error || "Akses ditolak"}</Alert></div>;
  }

  return (
    <>
      <main className="my-5">
        <Container style={{ maxWidth: '700px' }}>
          <Card className="p-4 shadow">
            <h3 className="text-center text-primary mb-4">Edit Buku (ID: {id})</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              {/* Form fields di sini, sama seperti AddBook */}
              <Form.Group className="mb-3">
                <Form.Label>Nama Buku</Form.Label>
                <Form.Control type="text" name="nama_buku" required value={formData.nama_buku} onChange={handleChange} />
              </Form.Group>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Tipe Buku</Form.Label><Form.Select name="tipe_buku" required value={formData.tipe_buku} onChange={handleChange}><option value="fisik">Fisik</option><option value="online">Online</option></Form.Select></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Jenis Buku</Form.Label><Form.Control type="text" name="jenis_buku" required value={formData.jenis_buku} onChange={handleChange} /></Form.Group></Col>
              </Row>
              <Form.Group className="mb-3"><Form.Label>Penulis</Form.Label><Form.Control type="text" name="author" required value={formData.author} onChange={handleChange} /></Form.Group>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Tanggal Terbit</Form.Label><Form.Control type="date" name="tgl_terbit" required value={formData.tgl_terbit} onChange={handleChange} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Jumlah</Form.Label><Form.Control type="number" name="jumlah" required min="1" value={formData.jumlah} onChange={handleChange} /></Form.Group></Col>
              </Row>
              <Form.Group className="mb-4">
                <Form.Label>Rak Buku</Form.Label>
                <Form.Select name="rakbuku_id_fk" required value={formData.rakbuku_id_fk} onChange={handleChange}>
                  <option value="">Pilih Rak Buku</option>
                  {staticRakOptions.map((rak) => (
                    <option key={rak.id} value={rak.id}>{rak.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button type="submit" variant="primary" disabled={loadingSubmit}>
                  {loadingSubmit ? <><Spinner as="span" animation="border" size="sm" /> Menyimpan...</> : 'Simpan Perubahan'}
                </Button>
                <Link to="/admin" className="btn btn-secondary">Batal</Link>
              </div>
            </Form>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default EditBook;