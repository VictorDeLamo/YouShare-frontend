import React, { useState } from 'react';
import { apiCall } from '../../Utils/api'; // Ajusta la ruta según sea necesario
import { useApplication } from '../../Utils/applicationProvider';
import { Input, Form, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom'; 

import './MagazineCreate.css';

const MagazineCreate = () => { 
  const { token } = useApplication();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { name, title, description, rules } = values;
    try {
      const newMagazine = await apiCall(`/magazines`, 'POST', null, { 
        name: name, 
        title: title, 
        description: description, 
        rules: rules 
      }, token);
      setName('');
      setTitle('');
      setDescription('');
      setRules('');
      navigate(`/magazine/${newMagazine.id}`);
    } catch (error) {
      if (error.status === 400) {
        message.error('Debes modificar algun campo');
      } else if (error.status === 401) {
        message.error('No has elegido usuario');
      } else if (error.status === 422) {
        message.error('El nombre y el titulo deben tener valor');
      } else {
        message.error('Unexpected error:', error.message);
      }
    }
  };
 
  return (
    <Form
      className="magazine-form"
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        label={<span className="form-label">Name</span>}
        name="name"
        rules={[{ required: true, message: 'Please input the magazine name!' }]}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="magazine name"
        />
      </Form.Item>

      <Form.Item
        label={<span className="form-label">Title</span>}
        name="title"
        rules={[{ required: true, message: 'Please input the magazine title!' }]}
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="magazine title"
        />
      </Form.Item>

      <Form.Item
        label={<span className="form-label">Description</span>}
        name="description"
      >
        <Input.TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="magazine description"
        />
      </Form.Item>

      <Form.Item
        label={<span className="form-label">Rules</span>}
        name="rules"
      >
        <Input.TextArea
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder="magazine rules"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Crear Revista
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MagazineCreate;
