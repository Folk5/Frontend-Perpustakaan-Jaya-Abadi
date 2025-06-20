import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DaftarBooking from "./pages/DaftarBooking";
import AdminDashboard from "./pages/AdminDashboard";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import AdminRoute from "./components/AdminRoute";
import ListPinjamanAdmin from "./pages/ListPinjamanAdmin";
import Chatbot from "./components/Chatbot";

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
  }, [location]);

  return (
    <>
      {isLoggedIn && <Chatbot />}

      <Routes>
        {/* Rute publik dan user biasa */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking" element={<DaftarBooking />} />

        {/* Grup Rute Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-book" element={<AddBook />} />
          <Route path="/admin/edit-book/:id" element={<EditBook />} />
          <Route path="/admin/list-pinjaman" element={<ListPinjamanAdmin />} />
        </Route>
      </Routes>
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;