import React from 'react';
import ListElement from './ListElement/ListElement';
import './CommentsList.css';

const renderComments = (comments, hiloId, onCommentDeleted, onReplyAdded, onCommentUpdated, fetchHilo) => {
  return comments.map(comment => (
    <div key={comment.id}>
      <ListElement
        id={comment.id}
        author={comment.username || 'Unknown'}
        date={new Date(comment.created_at).toLocaleDateString() + ' ' + new Date(comment.created_at).toLocaleTimeString()} 
        content={comment.content}
        hiloId={hiloId}
        onCommentDeleted={onCommentDeleted}
        onReplyAdded={onReplyAdded}
        onCommentUpdated={onCommentUpdated}
        fetchHilo={fetchHilo}
        likes={comment.likes}
        dislikes={comment.dislikes}
        boosts={comment.boosts}
        userId={comment.user_id}
      />
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {renderComments(comment.replies, hiloId, onCommentDeleted, onReplyAdded, onCommentUpdated, fetchHilo)}
        </div>
      )}
    </div>
  ));
};

const CommentsList = ({ comments, hiloId, onCommentDeleted, onReplyAdded, onCommentUpdated, fetchHilo }) => {
  return <div>{renderComments(comments, hiloId, onCommentDeleted, onReplyAdded, onCommentUpdated, fetchHilo)}</div>;
};

export default CommentsList;
