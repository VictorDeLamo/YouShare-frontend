import React, { useState, useEffect } from 'react';
import { apiCall } from '../../Utils/api'; // Adjust the path as necessary
import { useApplication } from '../../Utils/applicationProvider';
import { Input, Form, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom'; 

import './HiloCreate.css';
import { useCurrentUser } from '../../Utils/currentUserProvider';

const HiloCreate = () => { 
  const { token } = useApplication();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [magazine_id, setMagazine_id] = useState('');
  const [magazines, setMagazines] = useState([]);

  const { addForOwner } = useCurrentUser();
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const magazinesData = await apiCall(`/magazines`, 'GET');
        setMagazines(magazinesData.map(magazine => ({
          value: magazine.id,
          label: magazine.name
        })));
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const newHilo = await apiCall(`/hilos`, 'POST', null, { 
        title: values.title, 
        content: values.content, 
        magazine_id: values.magazine_id
      }, token);
      setContent('');
      setTitle('');
      setMagazine_id('');
      addForOwner(newHilo.id);
      navigate(`/hilo/${newHilo.id}`);
    } catch (error) {
      if (error.status === 400) {
        message.error('Debes modificar algun campo');
      } else if (error.status === 401) {
        message.error('No has elegijo usuario');
      } else if (error.status === 422) {
        message.error('El magazine y el titulo deben tener valor');
      } else {
        message.error('Unexpected error:', error.message);
      }
    }
  };

  const handleChange = (value) => {
    setMagazine_id(value);
  };

  return (
    <Form
      className="magazine-form"
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        label={<span className="form-label">Title</span>}
        name="title"
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter hilo title"
        />
      </Form.Item>

      <Form.Item
        label={<span className="form-label">Content</span>}
        name="content"
      >
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter hilo content"
        />
      </Form.Item>

      <Form.Item
        label={<span className="form-label">Revistas disponibles</span>}
        name="magazine_id"
      >
        <Select
          value={magazine_id}
          style={{ width: 120 }}
          onChange={handleChange}
          placeholder="Select a magazine"
          options={magazines}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Crear Hilo
        </Button>
      </Form.Item>
    </Form>
  );
};

export default HiloCreate;
