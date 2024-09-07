import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '../../Utils/api'; // Ajusta la ruta según sea necesario
import './UserEdit.css';
import { useApplication } from '../../Utils/applicationProvider';
import { message } from 'antd';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    description: '',
    avatar_url: '',
    cover_url: ''
  });
  const [error, setError] = useState(null);
  const { token } = useApplication();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await apiCall(`/users/${id}`, 'GET');
        setUserData(data);
        setAvatarPreview(data.avatar_url);
        setCoverPreview(data.cover_url);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (name === 'avatar_url') {
        setAvatarFile(file);
        setAvatarPreview(previewUrl);
      } else if (name === 'cover_url') {
        setCoverFile(file);
        setCoverPreview(previewUrl);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user[description]', userData.description);
    if (avatarFile) formData.append('user[avatar]', avatarFile);
    if (coverFile) formData.append('user[cover]', coverFile);

    try {
      await apiCall(`/users/${id}`, 'PUT', null, formData, token, true);
      navigate(`/user/${id}`);
    } catch (error) {
      if (error.status === 401) {
        setError(error.message);
        message.error('No has elegido usuario');
      } else if (error.status === 403) {
        setError(error.message);
        message.error('No eres el propietario');
      } else {
        setError(error.message);
        message.error('Unexpected error:', error.message);
      }
    }
  };

  return (
    <div className="user-edit-container">
      <h1 className="user-edit-title">Editar Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div className="user-edit-form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
        </div>
        <div className="user-edit-form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </div>
        <div className="user-edit-form-group">
          <label htmlFor="description">Descripción</label>
          <input
            type="text"
            id="description"
            name="description"
            value={userData.description}
            onChange={handleChange}
          />
        </div>
        <div className="user-edit-form-group">
          <label htmlFor="avatar_url">Avatar</label>
          <input
            type="file"
            id="avatar_url"
            name="avatar_url"
            accept="image/*"
            onChange={handleFileChange}
          />
          {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" style={{ width: '100px', height: '100px' }} />}
        </div>
        <div className="user-edit-form-group">
          <label htmlFor="cover_url">Cover</label>
          <input
            type="file"
            id="cover_url"
            name="cover_url"
            accept="image/*"
            onChange={handleFileChange}
          />
          {coverPreview && <img src={coverPreview} alt="Cover Preview" style={{ width: '100px', height: '100px' }} />}
        </div>
        <button className="user-edit-button" type="submit">Guardar Cambios</button>
        {error && <p className="user-edit-error">{error}</p>}
      </form>
    </div>
  );
};

export default UserEdit;
