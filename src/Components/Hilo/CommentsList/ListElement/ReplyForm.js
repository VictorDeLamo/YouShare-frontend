// src/Components/Hilo/CommentsList/ListElement/ReplyForm.js
import React, { useState } from 'react';
import { Button } from 'antd';
import { apiCall } from '../../../../Utils/api';
import './ReplyForm.css';
import { useApplication } from '../../../../Utils/applicationProvider';
import { message } from 'antd';

const ReplyForm = ({ parentId, hiloId, onReplyAdded }) => {
  const [content, setContent] = useState('');
  const { token } = useApplication();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (content.trim() === '') {
      message.error('Content empty or too long');
      return;
    }

    try {
      const body = { content, parent_id: parentId };
      const newReply = await apiCall(`/hilos/${hiloId}/comments`, 'POST', null, body, token);
      setContent('');
      onReplyAdded(newReply);
      message.info('Respuesta agregada');
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
    <form className="reply-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Responder a este comentario"
        className="reply-input"
        required
      />
      <Button type="primary" className="reply-button" htmlType="submit">
        Responder
      </Button>
    </form>
  );
};

export default ReplyForm;
