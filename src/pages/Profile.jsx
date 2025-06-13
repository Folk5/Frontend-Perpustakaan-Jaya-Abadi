// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit3, User, Mail, Calendar } from 'lucide-react';
import "../styles/Profile.css";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        displayName: '',
        lastName: '',
        email: '',
        birthDate: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accountId, setAccountId] = useState(null);

    useEffect(() => {
        const storedAccountId = localStorage.getItem('accountId');
        if (storedAccountId) {
            setAccountId(storedAccountId);
            fetchUserProfile(storedAccountId);
        } else {
            setError("Account ID tidak ditemukan. Harap login terlebih dahulu.");
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/profile/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = response.data;
            setUserData({
                displayName: data.nama_depan || '',
                lastName: data.nama_belakang || '',
                email: data.email || '',
                birthDate: data.tanggal_lahir || ''
            });
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError("Gagal memuat data profil.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');

            const payload = {
                nama_depan: userData.displayName,
                nama_belakang: userData.lastName,
                tanggal_lahir: userData.birthDate,
                email: userData.email
            };

            await axios.put(`http://localhost:8080/api/profile/${accountId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setIsEditing(false);
            alert("Profil berhasil diperbarui!");
            fetchUserProfile(accountId);
        } catch (err) {
            console.error("Error saving user profile:", err);
            setError("Gagal menyimpan perubahan profil.");
            alert("Gagal menyimpan perubahan profil. Coba lagi nanti.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="user-profile loading-message">Memuat profil...</div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="user-profile error-message">{error}</div>
                <Footer />
            </>
        );
    }

    return (
        <div className="user-profile-page-wrapper">
            <Navbar />

            <div className="user-profile">
                {/* Main Content */}
                <div className="user-profile__main-content">
                    {/* Profile Card */}
                    <div className="user-profile__card">
                        {/* Title */}
                        <h1 className="user-profile__title">Profil Saya</h1>

                        {/* Profile Picture */}
                        <div className="user-profile__picture">
                            <div className="user-profile__avatar">
                                <User className="user-profile__avatar-icon" />
                            </div>
                        </div>

                        {/* Profile Fields */}
                        <div className="user-profile__fields">
                            {/* Display Name */}
                            <div className="user-profile__field">
                                <div className="user-profile__field-content">
                                    <User className="user-profile__field-icon" />
                                    <div className="user-profile__field-info">
                                        <p className="user-profile__field-label">Nama Depan</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={userData.displayName}
                                                onChange={(e) => handleInputChange('displayName', e.target.value)}
                                                className="user-profile__field-input"
                                            />
                                        ) : (
                                            <p className="user-profile__field-value">{userData.displayName}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Last Name */}
                            <div className="user-profile__field">
                                <div className="user-profile__field-content">
                                    <User className="user-profile__field-icon" />
                                    <div className="user-profile__field-info">
                                        <p className="user-profile__field-label">Nama Belakang</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={userData.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                className="user-profile__field-input"
                                            />
                                        ) : (
                                            <p className="user-profile__field-value">{userData.lastName}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="user-profile__field">
                                <div className="user-profile__field-content">
                                    <Mail className="user-profile__field-icon" />
                                    <div className="user-profile__field-info">
                                        <p className="user-profile__field-label">Email</p>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={userData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="user-profile__field-input"
                                            />
                                        ) : (
                                            <p className="user-profile__field-value">{userData.email}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Birth Date */}
                            <div className="user-profile__field">
                                <div className="user-profile__field-content">
                                    <Calendar className="user-profile__field-icon" />
                                    <div className="user-profile__field-info">
                                        <p className="user-profile__field-label">Tanggal Lahir</p>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={userData.birthDate}
                                                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                                className="user-profile__field-input"
                                            />
                                        ) : (
                                            <p className="user-profile__field-value">{userData.birthDate}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <div className="user-profile__button-container">
                        {isEditing ? (
                            <div className="user-profile__button-group">
                                <button
                                    onClick={handleSave}
                                    className="user-profile__button user-profile__button--save"
                                    disabled={loading}
                                >
                                    {loading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="user-profile__button user-profile__button--cancel"
                                    disabled={loading}
                                >
                                    Batal
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="user-profile__button user-profile__button--edit"
                                disabled={loading}
                            >
                                <Edit3 className="user-profile__button-icon" />
                                <span>Edit Profil</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default UserProfile;