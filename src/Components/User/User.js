// src/Components/User/User.js
import React, { useEffect, useState } from 'react';
import './User.css';
import { apiCall } from '../../Utils/api'; // Ajusta la ruta según sea necesario
import { useParams, useNavigate } from 'react-router-dom';
import ListElement from '../HilosList/ListElement/ListElement';
import ListElementC from '../Hilo/CommentsList/ListElement/ListElement';
import { Empty, message } from 'antd';
import { useApplication } from '../../Utils/applicationProvider';

const User = () => {
  const [usersData, setUsers] = useState({});
  const [error, setError] = useState(null);
  const [errorC, setErrorC] = useState(null);
  const [errorB, setErrorB] = useState(null);
  const { id } = useParams();
  const [hilos, setHilos] = useState([]);
  const [comments, setComments] = useState([]);
  const [boosts, setBoosts] = useState([]);
  const [activeTab, setActiveTab] = useState('hilos'); // Estado para la pestaña activa
  const navigate = useNavigate();
  const { token } = useApplication();

  const fetchPosts = async () => {
    try {
      const usersData = await apiCall(`/users/${id}`, 'GET');
      setUsers(usersData);

      const hilosData = await apiCall(`/users/${id}/hilos`, 'GET');
      setHilos(hilosData);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching data:', error);
    }
    try {
      const commentsData = await apiCall(`/users/${id}/comments`, 'GET');
      setComments(commentsData);
    } catch (error) {
      setErrorC(error.message);
      console.error('Error fetching data:', error);
    }
    if(token){
      try {
        const boostsData = await apiCall(`/users/${id}/boosts`, 'GET', null, null, token);
        setBoosts(boostsData);
      } catch (error) {
        if (error.status === 401) {
          setErrorB(error.message);
          message.error('No has elegido usuario');
        } else if (error.status === 403) {
          setErrorB(error.message);
          message.error('No eres el propietario');
        } else {
          setErrorB(error.message);
          message.error('Unexpected error:', error.message);
        }
      }
  
    
  }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  const handleEditProfile = () => {
    navigate(`/user/${id}/edit`);
  };

  const handleBoost = () => {
      fetchPosts();
      setActiveTab('boosts');
      
  };
  const handleComments = () => {
    setActiveTab('comments');
    
};
const handleHilos = () => {
  setActiveTab('hilos');
  
};

  return (
    <div className="user-profile">
      <div className="user-header">
        <img src={usersData.cover_url} alt="Cover" className="cover-image" />
        <div className="user-info">
          <img src={usersData.avatar_url} alt="Avatar" className="avatar-image" />
          <h2>{usersData.username}</h2>
          <p>{usersData.email}</p>
          <p>{usersData.description}</p>
          <div className="user-actions">
            <button onClick={handleEditProfile}>Editar Profile</button>
            <button>My ApiKey</button>
          </div>
        </div>
      </div>
      <div className="user-content">
        <ul className="tabs">
          <li className={activeTab === 'hilos' ? 'active' : ''} onClick={() => handleHilos()}>Hilos ({hilos.length})</li>
          <li className={activeTab === 'comments' ? 'active' : ''} onClick={() => handleComments()}>Comments ({comments.length})</li>
          <li className={activeTab === 'boosts' ? 'active' : ''} onClick={() =>  handleBoost()}>Boosts ({boosts.length})</li>
        </ul>
        <div className="tab-content">
          {activeTab === 'hilos' && (
            <div>
              <h3>Hilos:</h3>
              {error ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : hilos.length > 0 ? (
                hilos.map(hilo => (
                  <ListElement
                    key={hilo.id}
                    id={hilo.id}
                    title={hilo.title}
                    link={hilo.url}
                    author= {hilo.propietario.username}
                    date={new Date(hilo.created_at).toLocaleDateString()}
                    comments={hilo.comments?.length || 0}
                    content={hilo.content}
                  />
                ))
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          )}
          {activeTab === 'comments' && (
            <div>
              <h3>Comments:</h3>
              {errorC ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id}>
                    <ListElementC
                      id={comment.id}
                      author={comment.username || 'Unknown'}
                      date={new Date(comment.created_at).toLocaleDateString()}
                      content={comment.content}
                      likes={comment.likes}
                      dislikes={comment.dislikes}
                      boosts={comment.boosts}
                    />
                  </div>
                ))
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          )}
          {activeTab === 'boosts' && (
            <div>
              <h3>Boosts:</h3>
              {errorB ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : boosts.length > 0 ? (
                boosts.map(hilo => (
                  <ListElement
                    key={hilo.id}
                    id={hilo.id}
                    title={hilo.title}
                    link={hilo.url}
                    author={hilo.propietario.username}
                    date={new Date(hilo.created_at).toLocaleDateString()}
                    comments={hilo.comments?.length || 0}
                    content={hilo.content}
                  />
                ))
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
