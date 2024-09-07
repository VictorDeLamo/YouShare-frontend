import React, { useEffect, useState } from 'react';
import { apiCall } from '../../Utils/api'; // Ajusta la ruta según sea necesario
import { useApplication } from '../../Utils/applicationProvider';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Form, Button, message } from 'antd';

import './MagazineUpdate.css';

const MagazineUpdate = () => { 
  const { token } = useApplication();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const navigate = useNavigate();

  const { id } = useParams();
  const [magazine, setMagazine] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const magazineData = await apiCall(`/magazines/${id}`, 'GET');
        setMagazine(magazineData);
        setName(magazine.name);
        setTitle(magazine.title);
        setDescription(magazine.description);
        setRules(magazine.rules);

      } catch (error) {
        message.error(error.message);
      }
    };

    fetchPosts();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const updateMagazine = await apiCall(`/magazines/${id}`, 'PUT', null,{ 
        name: name, 
        title: title, 
        description: description, 
        rules: rules 
      }, token);
      setName('');
      setTitle('');
      setDescription('');
      setRules('');
      navigate(`/magazine/${updateMagazine.id}`);
    } catch (error) {
      if (error.status === 400) {
        message.error('Debes modificar algun campo');
      } else if (error.status === 401) {
        message.error('No has elegijo usuario');
      } else if (error.status === 403) {
        message.error('No eres el propietario');
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
        label="Name"
        name="name"
        initialValue={magazine.name}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={magazine.name}
        />
      </Form.Item>

      <Form.Item
        label="Title"
        name="title"
        initialValue={magazine.title}
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={magazine.title}
        />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        initialValue={magazine.description}
      >
        <Input.TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={magazine.description}
        />
      </Form.Item>

      <Form.Item
        label="Rules"
        name="rules"
        initialValue={magazine.rules}
      >
        <Input.TextArea
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder={magazine.rules}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          Actualizar Revista
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MagazineUpdate;
