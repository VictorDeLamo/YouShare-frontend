import React, { useState, useEffect } from 'react';
import { apiCall } from '../../Utils/api'; // Ajusta la ruta según sea necesario
import { useApplication } from '../../Utils/applicationProvider';
import { Input, Form, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom'; 

import './LinkCreate.css';

const LinkCreate = () => { 
  const { token } = useApplication();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [magazine_id, setMagazine_id] = useState('');
  const [magazines, setMagazines] = useState([]);
  
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
    const { title, content, url, magazine_id } = values;
    if (!url) {
      message.error('El url debe tener valor');
    } else {
      try {
        const newLink = await apiCall(`/hilos`, 'POST', null, { 
          title: title, 
          content: content, 
          url: url,
          magazine_id: magazine_id
        }, token);
        setContent('');
        setTitle('');
        setUrl('');
        setMagazine_id('');
        
        navigate(`/hilo/${newLink.id}`);
      } catch (error) {
        if (error.status === 400) {
          message.error('Debes modificar algun campo');
        } else if (error.status === 401) {
          message.error('No has elegido usuario');
        } else if (error.status === 422) {
          message.error('El magazine y el titulo deben tener valor');
        } else {
          message.error('Unexpected error:', error.message);
        }
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
        rules={[{ required: true, message: 'Please input the title!' }]}
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter link title"
        />
      </Form.Item>

      <Form.Item
        label={<span className="form-label">Content</span>}
        name="content"
        rules={[{ required: true, message: 'Please input the content!' }]}
      >
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter link content"
        />
      </Form.Item>

      <Form.Item
        label={<span className="form-label">Url</span>}
        name="url"
        rules={[{ required: true, message: 'Please input the URL!' }]}
      >
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter link url"
        />
      </Form.Item>

      <Form.Item
        label={<span className="form-label">Revistas disponibles</span>}
        name="magazine_id"
        rules={[{ required: true, message: 'Please select a magazine!' }]}
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
          Crear Link
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LinkCreate;
