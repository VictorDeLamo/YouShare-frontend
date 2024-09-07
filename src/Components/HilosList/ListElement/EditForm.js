// src/Components/Hilo/ListElement/EditForm.js
import React, { useState } from 'react';
import { Button } from 'antd';
import { apiCall } from '../../../Utils/api';
import './EditForm.css';
import { useApplication } from '../../../Utils/applicationProvider';
import { message } from 'antd';

const EditForm = ({ hiloId, currentTitle, currentContent, fetchPosts }) => {
  const [title, setTitle] = useState(currentTitle);
  const [content, setContent] = useState(currentContent);
  const { token } = useApplication();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (title.trim() === '' || content.trim() === '') {
      message.error('Título o contenido vacío');
      return;
    }

    try {
      const body = { title, content };
      await apiCall(`/hilos/${hiloId}`, 'PUT', null, body, token);
      fetchPosts(); // Llamada a fetchPosts para actualizar la página
      message.info('Hilo editado');
    } catch (error) {
      if (error.status === 400) {
        message.error('Título o contenido vacío');
      } else if (error.status === 403) {
        message.error('No eres el propietario');
      } else if (error.status === 401) {
        message.error('No has elegido usuario');
      } else if (error.status === 404) {
        message.error('Not Found');
      } else {
        message.error('Unexpected error:', error.message);
      }
    }
  };

  return (
    <form className="edit-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Editar título"
        className="edit-input"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Editar contenido"
        className="edit-input"
        required
      />
      <Button type="primary" className="edit-button" htmlType="submit">
        Actualizar
      </Button>
    </form>
  );
};

export default EditForm;
