// src/Components/Hilo/CommentsList/ListElement/EditForm.js
import React, { useState } from 'react';
import { Button } from 'antd';
import { apiCall } from '../../../../Utils/api';
import './EditForm.css';
import { useApplication } from '../../../../Utils/applicationProvider';
import { message } from 'antd';

const EditForm = ({ commentId, hiloId, currentContent, fetchHilo }) => {
  const [content, setContent] = useState(currentContent);
  const { token } = useApplication();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (content.trim() === '') {
      message.error('Content empty or too long');
      return;
    }

    try {
      const body = { content };
      await apiCall(`/hilos/${hiloId}/comments/${commentId}`, 'PUT', null, body, token);
      fetchHilo(); // Llamada a fetchHilo para actualizar la página
      message.info('hilo editado');
    } catch (error) {
      if (error.status === 400) {
        message.error('Content empty or too long');
      } else if (error.status === 403) {
        message.error('No eres el propietario');
      } else if (error.status === 401) {
        message.error('No has elegijo usuario');
      } else if (error.status === 404) {
        message.error('Not Found');
      } else {
        message.error('Unexpected error:', error.message);
      }
    }
  };

  return (
    <form className="edit-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Editar comentario"
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
