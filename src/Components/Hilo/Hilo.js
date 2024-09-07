// Hilo.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CommentsList from './CommentsList/CommentsList';
import { message } from 'antd';
import { apiCall } from '../../Utils/api';
import './Hilo.css';
import CommentForm from './CommentForm';
import FiltroComment from './FiltroComment';
import ListElement from '../HilosList/ListElement/ListElement';  // Importar el componente ListElement

const Hilo = () => {
  const { id } = useParams();
  const { hash } = useLocation();
  const [hilo, setHilo] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('newest');

  const fetchHilo = async (filter = selectedFilter) => {
    try {
      const params = { comments_order: filter };
      const data = await apiCall(`/hilos/${id}`, 'GET', params);
      setHilo(data);
      setComments(data.comments || []);
    } catch (error) {
      setError(error.message);
      message.error('Error fetching hilo data');
    }
  };
  

  useEffect(() => {
    fetchHilo();
  }, [id, selectedFilter]);

  useEffect(() => {
    if (hash === '#comments') {
      const element = document.getElementById('comments');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash, comments]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    fetchHilo(filter);
  };

  const addReplyToComments = (newReply) => {
    const addReply = (commentsList) => {
      return commentsList.map(comment => {
        if (comment.id === newReply.parent_id) {
          return {
            ...comment,
            replies: comment.replies ? [...comment.replies, newReply] : [newReply],
          };
        } else if (comment.replies) {
          return {
            ...comment,
            replies: addReply(comment.replies),
          };
        }
        return comment;
      });
    };
    setComments(prevComments => addReply(prevComments));
    fetchHilo();
  };

  const updateCommentInState = (commentId, newContent) => {
    const updateComment = (commentsList) => {
      return commentsList.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            content: newContent,
          };
        } else if (comment.replies) {
          return {
            ...comment,
            replies: updateComment(comment.replies),
          };
        }
        return comment;
      });
    };
    setComments(prevComments => updateComment(prevComments));
    fetchHilo();
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!hilo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hilo">
      <ListElement 
        id={hilo.id}
        title={hilo.title}
        link={hilo.url}
        author={hilo.propietario.username || 'Unknown'}
        date={new Date(hilo.created_at).toLocaleDateString() + ' ' + new Date(hilo.created_at).toLocaleTimeString()}
        comments={hilo.comments_count}
        content={hilo.content}
        likes={hilo.likes}
        dislikes={hilo.dislikes}
        boostsCount={hilo.boosts_count}
        fetchPosts={fetchHilo}
        magazineId={hilo.magazine.id}
        magazineTitle={hilo.magazine.title}
        userId={hilo.propietario.id}
      />
      <CommentForm hiloId={id} onCommentAdded={fetchHilo} />
      <FiltroComment selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />
      <div id="comments">
        <CommentsList 
          comments={comments} 
          hiloId={id} 
          onCommentDeleted={fetchHilo} 
          onReplyAdded={addReplyToComments} 
          onCommentUpdated={updateCommentInState} 
          fetchHilo={fetchHilo} 
        />
      </div>
    </div>
  );
};

export default Hilo;
