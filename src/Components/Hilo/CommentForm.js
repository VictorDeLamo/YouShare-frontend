// src/Components/Hilo/CommentForm.js
import React, { useState } from 'react';
import { Button } from 'antd';
import { apiCall } from '../../Utils/api';
import './CommentForm.css';
import { useApplication } from '../../Utils/applicationProvider';
import { message } from 'antd';

const CommentForm = ({ hiloId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const { token } = useApplication();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (content.trim() === '') {
      message.error('Content empty or too long');
      return;
    }

    try {
      const body = { content };

      const newComment = await apiCall(`/hilos/${hiloId}/comments`, 'POST', null, body, token);
      setContent('');
      onCommentAdded(newComment);
      message.info('Comentario agregado');
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
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Añadir un nuevo comentario"
        className="comment-input"
        required
      />
      <Button type="primary" className="comment-button" htmlType="submit">
        Añadir comentario
      </Button>
    </form>
  );
};

export default CommentForm;
