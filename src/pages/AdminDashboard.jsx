import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const bukuList = [
    {
      nama: 'Hujan',
      tipe: 'fisik',
      jenis: 'Novel',
      tanggal: '2016-12-04',
      author: 'Tere Liye',
      rak: 'Non-Fiksi',
      status: 'Tersedia',
    },
    {
      nama: 'Atomic Habits',
      tipe: 'fisik',
      jenis: 'Edukasi',
      tanggal: '2018-12-08',
      author: 'James Clear',
      rak: 'Fiksi',
      status: 'Tidak Tersedia',
    },
    {
      nama: 'Dune',
      tipe: 'fisik',
      jenis: 'Novel',
      tanggal: '1965-07-02',
      author: 'Frank Herbert',
      rak: 'Non-Fiksi',
      status: 'Tidak Tersedia',
    },
    {
      nama: 'Komet Minor',
      tipe: 'fisik',
      jenis: 'Fiction',
      tanggal: '2019-03-12',
      author: 'Tere Liye',
      rak: 'Fiksi',
      status: 'Tersedia',
    },
  ];

  const rakList = [
    { id: 1, jenis: 'Fiksi', lokasi: 'Rak A' },
    { id: 2, jenis: 'Non-Fiksi', lokasi: 'Rak B' },
  ];

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h1 className="text-primary">Admin Dashboard</h1>
        <p className="lead text-secondary">Kelola Buku dan Rak Buku Perpustakaan</p>
        <div className="mb-3">
          <button className="btn btn-primary me-2">Beranda</button>
          <button className="btn btn-danger">Keluar</button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-secondary">Daftar Buku</h3>
        <button className="btn btn-primary">List Pinjaman</button>
      </div>

      <div className="d-flex mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Cari buku berdasarkan nama, tipe, jenis, atau author..."
        />
        <button className="btn btn-primary me-2">Cari</button>
        <button className="btn btn-primary">Tambah Buku</button>
      </div>

      <div className="card mb-4 p-3 shadow">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nama Buku</th>
              <th>Tipe Buku</th>
              <th>Jenis Buku</th>
              <th>Tanggal Terbit</th>
              <th>Author</th>
              <th>Rak Buku</th>
              <th>Status Buku</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bukuList.map((buku, index) => (
              <tr key={index}>
                <td>{buku.nama}</td>
                <td>{buku.tipe}</td>
                <td>{buku.jenis}</td>
                <td>{buku.tanggal}</td>
                <td>{buku.author}</td>
                <td>{buku.rak}</td>
                <td
                  className={`fw-bold ${
                    buku.status === 'Tersedia' ? 'text-success' : 'text-danger'
                  }`}
                >
                  {buku.status}
                </td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">Edit</button>
                  <button className="btn btn-danger btn-sm">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-secondary">Daftar Rak Buku</h3>
        <button className="btn btn-primary">Tambah Rak Buku</button>
      </div>

      <div className="card mb-4 p-3 shadow">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID Rak</th>
              <th>Jenis Rak</th>
              <th>Lokasi</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rakList.map((rak) => (
              <tr key={rak.id}>
                <td>{rak.id}</td>
                <td>{rak.jenis}</td>
                <td>{rak.lokasi}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">Edit</button>
                  <button className="btn btn-danger btn-sm">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
