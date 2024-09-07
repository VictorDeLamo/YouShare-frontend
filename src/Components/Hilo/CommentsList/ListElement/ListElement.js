import React, { useState } from 'react';
import { apiCall } from '../../../../Utils/api';
import './ListElement.css';
import ReplyForm from './ReplyForm';
import EditForm from './EditForm';
import { EditTwoTone, DeleteTwoTone, FireTwoTone, RightCircleTwoTone, UpCircleFilled, DownCircleFilled } from '@ant-design/icons'; // Importa el ícono de Ant Design
import { useApplication } from '../../../../Utils/applicationProvider';
import { message } from 'antd';
import { Link } from 'react-router-dom';

const ListElement = ({ id, author, date, content, hiloId, onCommentDeleted, onReplyAdded, onCommentUpdated, fetchHilo, replies, likes, dislikes, boosts, userId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);  // Estado para like
  const [isDisliked, setIsDisliked] = useState(false);  // Estado para dislike
  const [isBoosted, setIsBoosted] = useState(false);  // Estado para boost
  const { token } = useApplication();

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleEditClick = () => {
    setShowEditForm(!showEditForm);
  };

  const handleDeleteClick = async () => {
    try {
      await apiCall(`/hilos/${hiloId}/comments/${id}`, 'DELETE', null, null, token);
      onCommentDeleted(id);
      message.info('Eliminado con éxito');
    } catch (error) {
      if (error.status === 401) {
        message.error('No has elegijo usuario');
      } else if (error.status === 403) {
        message.error('No eres el propietario');
      } else if (error.status === 404) {
        message.error('Not Found');
      } else {
        message.error('Unexpected error:', error.message);
      }
    }
  };

  const handleLikeClick = async () => {
      try {
        await apiCall(`/hilos/${hiloId}/comments/${id}/like`, 'POST', null, null, token);
        setIsLiked(prevIsLiked => !prevIsLiked);  // Alternar estado de like solo si la solicitud tiene éxito
        setIsDisliked(false);  // Asegurarse de que dislike esté desactivado
        fetchHilo();
        if(isLiked===true) message.info('Like removed');
        else message.info('Like added');
      } catch (error) {
        if (error.status === 401) {
          message.error('No has elegijo usuario');
        } else if (error.status === 404) {
          message.error('Resource not found');
        } else {
          message.error('Unexpected error:', error.message);
        }
      }
  };

  const handleDislikeClick = async () => {
    try {
      await apiCall(`/hilos/${hiloId}/comments/${id}/dislike`, 'POST', null, null, token);
      fetchHilo();
      setIsDisliked(prevIsDisliked => !prevIsDisliked);  // Alternar estado de dislike
      setIsLiked(false);  // Asegurarse de que like esté desactivado
      if(isDisliked===false) message.info('Dislike added');
      else message.info('Dislike removed');
    } catch (error) {
      if (error.status === 401) {
        message.error('No has elegijo usuario');
      } else if (error.status === 404) {
        message.error('Resource not found');
      } else {
        message.error('Unexpected error:', error.message);
      }
    }
    
  };

  const handleBoostClick = async () => {
    try {
      await apiCall(`/hilos/${hiloId}/comments/${id}/boost`, 'POST', null, null, token);
      fetchHilo();
      setIsBoosted(prevIsBoosted => !prevIsBoosted);  // Alternar estado de boost
      if(isBoosted===true) message.info('Unboosted');
      else message.info('Boosted');
    } catch (error) {
      if (error.status === 401) {
        message.error('No has elegijo usuario');
      } else if (error.status === 404) {
        message.error('Resource not found');
      } else {
        message.error('Unexpected error:', error.message);
      }
    }
  };

  const handleUpdateSuccess = async () => {
    await fetchHilo();
    setShowEditForm(false); // Ocultar el EditForm después de la actualización exitosa
  };

  return (
    <div className="list-element">
      <div className="reactions">
        <button className={`like-button ${isLiked ? 'active' : ''}`} onClick={handleLikeClick}>
          <span className="like-count">{likes}</span>
          <span className={`like-arrow ${isLiked ? 'liked' : ''}`}>
            <UpCircleFilled />
          </span>
        </button>
        <button className={`dislike-button ${isDisliked ? 'active' : ''}`} onClick={handleDislikeClick}>
          <span className="dislike-count">{dislikes}</span>
          <span className={`dislike-arrow ${isDisliked ? 'disliked' : ''}`}>
            <DownCircleFilled />
          </span>
        </button>
      </div>
      <div className="content">
        <p>{content}</p>
        <small>
          By <strong><Link to={`/user/${userId}`} className="author-link">{author}</Link></strong>, {date}
        </small>
        <div className="actions">
          <button className="reply-button" onClick={handleReplyClick}>
            <RightCircleTwoTone /> Responder
          </button>
          <button className={`boost-button ${isBoosted ? 'active' : ''}`} onClick={handleBoostClick}>
          <FireTwoTone /> {isBoosted ? 'Desimpulsar' : 'Impulsar'} ({boosts})
          </button>
          <button className="edit-button" onClick={handleEditClick}>
            <EditTwoTone /> Edit
          </button>
          <button className="delete-button" onClick={handleDeleteClick}>
            <DeleteTwoTone /> Eliminar
          </button>
        </div>
        {showReplyForm && (
          <ReplyForm parentId={id} hiloId={hiloId} onReplyAdded={(newReply) => {
            onReplyAdded(newReply);
            setShowReplyForm(false);
          }} />
        )}
        {showEditForm && (
          <EditForm commentId={id} hiloId={hiloId} currentContent={content} fetchHilo={handleUpdateSuccess} />
        )}
        {replies && replies.length > 0 && (
          <div className="replies">
            {replies.map(reply => (
              <ListElement
                key={reply.id}
                id={reply.id}
                author={reply.username || 'Unknown'}
                date={new Date(reply.created_at).toLocaleDateString()}
                content={reply.content}
                hiloId={hiloId}
                onCommentDeleted={onCommentDeleted}
                onReplyAdded={onReplyAdded}
                onCommentUpdated={onCommentUpdated}
                fetchHilo={fetchHilo}
                replies={reply.replies}
                likes={reply.likes}
                dislikes={reply.dislikes}
                boosts={reply.boosts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListElement;
