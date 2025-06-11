import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddBuku = () => {
  const [formData, setFormData] = useState({
    nama_buku: '',
    tipe_buku: 'fisik',
    jenis_buku: '',
    tgl_terbit: '',
    author: '',
    rakbuku_id: '',
    jumlah: '',
    gambarBuku: null,
  });

  // Data rak buku bisa kamu fetch dari API nanti
  const rakOptions = [
    { id: 1, jenis: 'Fiksi' },
    { id: 2, jenis: 'Non-Fiksi' },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Data dikirim:', formData);

    // Simulasi kirim data form ke backend
    // Buat FormData jika upload file:
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // Contoh fetch POST (sesuaikan URL dan method)
    /*
    fetch('/api/buku', {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(result => {
        alert('Buku berhasil ditambahkan!');
      })
      .catch(error => {
        alert('Gagal menambahkan buku');
      });
    */
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card p-4 shadow-sm rounded">
        <h3 className="text-center text-primary mb-4">Tambah Buku Baru</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group mb-3">
            <label htmlFor="nama_buku">Nama Buku</label>
            <input
              type="text"
              name="nama_buku"
              id="nama_buku"
              className="form-control"
              required
              placeholder="Masukkan nama buku"
              value={formData.nama_buku}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="tipe_buku">Tipe Buku</label>
            <select
              name="tipe_buku"
              id="tipe_buku"
              className="form-control"
              required
              value={formData.tipe_buku}
              onChange={handleChange}
            >
              <option value="fisik">Fisik</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="jenis_buku">Jenis Buku</label>
            <input
              type="text"
              name="jenis_buku"
              id="jenis_buku"
              className="form-control"
              required
              placeholder="Masukkan jenis buku"
              value={formData.jenis_buku}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="tgl_terbit">Tanggal Terbit</label>
            <input
              type="date"
              name="tgl_terbit"
              id="tgl_terbit"
              className="form-control"
              required
              value={formData.tgl_terbit}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="author">Penulis</label>
            <input
              type="text"
              name="author"
              id="author"
              className="form-control"
              required
              placeholder="Masukkan nama penulis"
              value={formData.author}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="rakbuku_id">Rak Buku</label>
            <select
              name="rakbuku_id"
              id="rakbuku_id"
              className="form-control"
              required
              value={formData.rakbuku_id}
              onChange={handleChange}
            >
              <option value="">Pilih Rak Buku</option>
              {rakOptions.map((rak) => (
                <option key={rak.id} value={rak.id}>
                  {rak.jenis}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="jumlah">Jumlah Buku Masuk</label>
            <input
              type="number"
              name="jumlah"
              id="jumlah"
              className="form-control"
              required
              value={formData.jumlah}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="gambarBuku">Cover Buku</label>
            <input
              type="file"
              name="gambarBuku"
              id="gambarBuku"
              className="form-control"
              accept="image/*"
              required
              onChange={handleChange}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Tambah Buku
            </button>
            <a href="/dashboard" className="btn btn-secondary">
              Kembali
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBuku;
