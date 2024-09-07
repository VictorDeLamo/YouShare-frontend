import React, { useState } from 'react';
import './ListElement.css';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { EditTwoTone, DeleteTwoTone, FireTwoTone, UpCircleFilled, DownCircleFilled } from '@ant-design/icons';
import { useCurrentUser } from '../../../Utils/currentUserProvider';
import { useApplication } from '../../../Utils/applicationProvider';
import { useCalls } from '../../../Utils/callsProvider';
import EditForm from './EditForm';
import { useNavigate } from 'react-router-dom';

const ListElement = ({ id, title, link, author, date, comments, content, likes, dislikes, boostsCount, fetchPosts, magazineId, magazineTitle, userId}) => {

  const {handleBoost, handleDislike, handleLike, handleDeleteClick} = useCalls();
  const {isLiked, isBoosted, isDisliked, isOwner} = useCurrentUser();
  const { token } = useApplication();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const handleEditClick = () => {
    setShowEditForm(!showEditForm);
  };

  const handleUpdateSuccess = () => {
    fetchPosts();
    setShowEditForm(false); 
  };

  const handleDelete = () => {
    handleDeleteClick(id,fetchPosts);
    navigate('/');
  }

  const formatLink = (url) => {
    if (!url.match(/^https?:\/\//)) {
      return 'http://' + url;
    }
    return url;
  };

  return (
    <div className="hilo-list-element">
      <div className="reactions">
        <button className={`like-button ${isLiked(id) ? 'active' : ''}`} onClick={() => handleLike(id,fetchPosts)}>
          <span className={`like-arrow ${isLiked(id) ? 'liked' : ''}`}>
            <UpCircleFilled />
          </span>
          <span className="count">{likes}</span>
        </button>
        <button className={`dislike-button ${isDisliked(id) ? 'active' : ''}`} onClick={() => handleDislike(id,fetchPosts)}>
          <span className={`dislike-arrow ${isDisliked(id) ? 'disliked' : ''}`}>
            <DownCircleFilled />
          </span>
          <span className="count">{dislikes}</span>
        </button>
      </div>
      <div className="hilo-content">
        <h2>
          <Button type="link" className="title-button">
            <Link to={`/hilo/${id}`} className="title-link">{title}</Link>
          </Button>
          {link && 
            <Button type="link">
              <a href={formatLink(link)} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px' }}>{link}</a> 
            </Button>
          }
        </h2>
        <p>{content}</p>
        <small>
          By <strong><Link to={`/user/${userId}`} className="author-link">{author}</Link></strong>, {date}, in <strong><em><Link to={`/magazine/${magazineId}`} className="magazine-link">{magazineTitle}</Link></em></strong>
        </small>
        <div className="hilo-actions">
          <button className={`boost-button ${isBoosted(id) ? 'active' : ''}`} onClick={() => handleBoost(id,fetchPosts)}>
            <FireTwoTone /> {isBoosted(id) ? 'Desimpulsar' : 'Impulsar'} ({boostsCount})
          </button>
          <Link to={`/hilo/${id}#comments`} className="comments-link">
            <span>{comments} comentarios</span>
          </Link>
          {isOwner(id) && <button className="edit-button" onClick={handleEditClick}>
            <EditTwoTone /> Edit
          </button>}
          
          {isOwner(id) && <button className="delete-button" onClick={handleDelete}>
            <DeleteTwoTone /> Eliminar
          </button>}
        </div>
        {showEditForm && <EditForm hiloId={id} currentTitle={title} currentContent={content} fetchPosts={handleUpdateSuccess} />}
      </div>
    </div>
  );
};

export default ListElement;
