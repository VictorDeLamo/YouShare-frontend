// src/Components/Magazine/Magazine.js
import React, { useEffect, useState } from 'react';
import { apiCall } from '../../Utils/api'; // Ajusta la ruta según sea necesario
import { Empty } from 'antd';
import './Magazine.css';
import ListElement from '../HilosList/ListElement/ListElement';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { message,  Card, Typography, Row, Col, Button, Divider, FloatButton} from 'antd';
import { EditOutlined, DeleteOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useApplication } from '../../Utils/applicationProvider';

const { Title, Paragraph} = Typography;

const Magazine = () => {
  const { id } = useParams();
  const { token } = useApplication();
  const [magazine, setMagazine] = useState([]);
  const [hilos, setHilos] = useState([]);
  const [error, setError] = useState(null);
  const [propietario, setPropietario] = useState([]);
  const navigate = useNavigate();
  
  const fetchPosts = async () => {
    try {
      const magazineData = await apiCall(`/magazines/${id}`, 'GET');
      setMagazine(magazineData);
      setPropietario(magazineData.propietario);

      if (magazineData.hilos_ids) {
        const hilosPromises = magazineData.hilos_ids.map(hiloId => 
          apiCall(`/hilos/${hiloId}`, 'GET')
        );

        const hilosData = await Promise.all(hilosPromises);
        setHilos(hilosData);
      }

    } catch (error) {
      setError(error);
      message.error(error.message);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, [id]);

  const handleDeleClick = async () => {
    
    try {
      await apiCall(`/magazines/${id}`, 'DELETE', null, null, token);
      navigate('/magazineList');
    } catch (error) {
      if (error.status === 401) {
        message.error('No has elegijo usuario');
      } else if (error.status === 403) {
        message.error('No eres el propietario');
      } else {
        message.error('Unexpected error:', error.message);
      }
    }
  };

  const handleSuscribirseClick = async () => {
    try {
      let postRespuesta = await apiCall(`/magazines/${id}/suscribir`, 'POST', null, null, token);
      if(postRespuesta.error === 'You already follow it'){
        postRespuesta = await apiCall(`/magazines/${id}/suscribir`, 'DELETE', null, null, token);
      }
      message.info(postRespuesta.error);
      fetchPosts();
    } catch (error) {
      if (error.status === 401) {
        message.error('No has elegijo usuario');
      } else {
        message.error('Unexpected error:', error.message);
      }
    }
  }

  return (
    <div >
      <div className='magazine'>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={2}>{magazine.title}</Title>
            <Paragraph>{magazine.name}</Paragraph>
            <Paragraph>
              Propietario: <Link href={`/user/${propietario.id}`}>{propietario.username}</Link>
            </Paragraph>
            <Button shape="circle" icon={<UsergroupAddOutlined />} onClick={handleSuscribirseClick} />
            <span style={{ marginLeft: '8px' }}>{magazine.suscripciones_count}</span>
          </Col>
          <Col span={12}>
            <Title level={3}>ABOUT COMMUNITY</Title>
            <Paragraph>{magazine.description}</Paragraph>
            <Divider />
            <Title level={3}>REGLAS</Title>
            <Paragraph>{magazine.rules}</Paragraph>
          </Col>
        </Row>
      </Card>
      </div>
      <div>
        {error ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : hilos.length > 0 ? (
          hilos.map(hilo => (
            <ListElement
            key={hilo.id}
            id={hilo.id}
            title={hilo.title}
            link={hilo.url}
            author={hilo.propietario.username || 'Unknown'}
            date={new Date(hilo.created_at).toLocaleDateString()}
            comments={hilo.comments?.length || 0}
            content={hilo.content}
            likes={hilo.likes}
            dislikes={hilo.dislikes}
            boostsCount={hilo.boosts_count}
            fetchPosts={fetchPosts} // Pasa la función fetchPosts como propiedad
            magazineId={magazine.id}
            magazineTitle={magazine.title}
            userId={hilo.propietario.id}
            />
          ))
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      <FloatButton.Group>
      <Link to={`/magazines/${id}/edit`}><FloatButton shape="circle" icon={<EditOutlined/>}/></Link>
      <FloatButton shape="circle" icon={<DeleteOutlined />} onClick={handleDeleClick} />
      </FloatButton.Group>
    </div>
  );
};

export default Magazine;
