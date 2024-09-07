// src/Components/Magazine/MagazineList.js
import React, { useEffect, useState } from 'react';
import { message, Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { apiCall } from '../../Utils/api'; // Ajusta la ruta según sea necesario
import './MagazineList.css';
import { useApplication } from '../../Utils/applicationProvider';
import { Link } from 'react-router-dom';

const MagazineList = () => {
  const {token} = useApplication();
  const [magazines, setMagazines] = useState([]);
  const [error, setError] = useState(null);
  const [ordenDirec, setOrdenDirec] = useState('asc');
  const [ordenType, setOrdenType] = useState('title');

  const fetchPosts = async () => {
    try {
      const magazinesData = await apiCall('/magazines', 'GET', {'direction': ordenDirec, 'sort': ordenType});
      setMagazines(magazinesData);

    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  const handlerSuscribir = async (id) => {
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

  const handlerOrdenarTitulo = () => {
      if(ordenDirec === 'asc'){
        setOrdenDirec('desc');
      }else{
        setOrdenDirec('asc');
      }   
      if(ordenType !== 'title'){
        setOrdenType('title');
      }  
      message.info(`Ordenado por titulo ${ordenDirec}`);
      fetchPosts();
  }

  const handlerOrdenarHilos = () => {
    if(ordenDirec === 'asc'){
      setOrdenDirec('desc');
    }else{
      setOrdenDirec('asc');
    }   
    if(ordenType !== 'hilos'){
      setOrdenType('hilos');
    }  
    message.info(`Ordenado por Hilos ${ordenDirec}`);
    fetchPosts();
}

const handlerOrdenarComments = () => {
  if(ordenDirec === 'asc'){
    setOrdenDirec('desc');
  }else{
    setOrdenDirec('asc');
  }   
  if(ordenType !== 'comments'){
    setOrdenType('comments');
  }  
  message.info(`Ordenado por commentarios ${ordenDirec}`);
  fetchPosts();
}

const handlerOrdenarPubli = () => {
  if(ordenDirec === 'asc'){
    setOrdenDirec('desc');
  }else{
    setOrdenDirec('asc');
  }   
  if(ordenType !== 'publicaciones'){
    setOrdenType('publicaciones');
  }  
  message.info(`Ordenado por publicaciones ${ordenDirec}`);
  fetchPosts();
}

const handlerOrdenarSusci = () => {
  if(ordenDirec === 'asc'){
    setOrdenDirec('desc');
  }else{
    setOrdenDirec('asc');
  }   
  if(ordenType !== 'suscriptores'){
    setOrdenType('suscriptores');
  }  
  message.info(`Ordenado por suscriptores ${ordenDirec}`);
  fetchPosts();
}

  return (
    <div className="magazine-list">
      <h2>Lista de Revistas</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre <Button type="dashed" shape="circle" icon={ordenDirec === 'asc' ? <ArrowDownOutlined /> : <ArrowUpOutlined />} size="small" onClick={handlerOrdenarTitulo} /></th>
            <th>Hilos <Button type="dashed" shape="circle" icon={ordenDirec === 'asc' ? <ArrowDownOutlined /> : <ArrowUpOutlined />} size="small" onClick={handlerOrdenarHilos} /></th>
            <th>Comentarios <Button type="dashed" shape="circle" icon={ordenDirec === 'asc' ? <ArrowDownOutlined /> : <ArrowUpOutlined />} size="small" onClick={handlerOrdenarComments} /></th>
            <th>Publicaciones <Button type="dashed" shape="circle" icon={ordenDirec === 'asc' ? <ArrowDownOutlined /> : <ArrowUpOutlined />} size="small" onClick={handlerOrdenarPubli} /></th>
            <th>Suscripciones <Button type="dashed" shape="circle" icon={ordenDirec === 'asc' ? <ArrowDownOutlined /> : <ArrowUpOutlined />} size="small" onClick={handlerOrdenarSusci} /></th>
          </tr>
        </thead>
        <tbody>
          {magazines.map(magazine => (
            <tr key={magazine.id}>
              <td><Link to={`/magazine/${magazine.id}`} className='link-title'>{magazine.title}</Link></td>
              <td>{magazine.hilos_count}</td>
              <td>{magazine.comentarios_count}</td>
              <td>{magazine.publicaciones_count}</td>
              <td>
                <span>👥 {magazine.suscripciones_count}</span>
                <Button onClick={() => handlerSuscribir(magazine.id)}>+ Suscribirse</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MagazineList;
