// UserProfile.jsx
import React, { useState } from 'react';
import { Edit3, User, Mail, Calendar } from 'lucide-react';
import "../styles/Profile.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    displayName: 'Hibban Musyaffa',
    fullName: 'Muhammad Hibban Musyaffa',
    email: 'Hibban@gmail.com',
    birthDate: '2004-05-15'
  });

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Data saved:', userData);
  };

  return (
    <div className="user-profile">
      {/* Header */}
      <div className="user-profile__header">
        <div className="user-profile__header-content">
          <button className="user-profile__menu-button">
            <div className="user-profile__menu-icon">
              <div className="user-profile__menu-line"></div>
              <div className="user-profile__menu-line"></div>
              <div className="user-profile__menu-line"></div>
            </div>
          </button>
          {/* <button className="user-profile__logo-button">
            ⚡
          </button> */}
        </div>
      </div>

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

            {/* Full Name */}
            <div className="user-profile__field">
              <div className="user-profile__field-content">
                <User className="user-profile__field-icon" />
                <div className="user-profile__field-info">
                  <p className="user-profile__field-label">Nama Lengkap</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="user-profile__field-input"
                    />
                  ) : (
                    <p className="user-profile__field-value">{userData.fullName}</p>
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
              >
                Simpan
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="user-profile__button user-profile__button--cancel"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="user-profile__button user-profile__button--edit"
            >
              <Edit3 className="user-profile__button-icon" />
              <span>Edit Profil</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;