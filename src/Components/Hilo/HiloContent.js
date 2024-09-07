// HiloContent.js
import React from 'react';
import './HiloContent.css';
import { Link } from 'react-router-dom';

const HiloContent = ({ title, content, propietario, date, magazineId, magazineTitle}) => {
  return (
    <div className="hilo-content-hilo">
      <h1>{title}</h1>
      <p>{content}</p>
      <small>
        By <strong><Link to={`/user/${propietario.id}`} className="author-link">{propietario.username}</Link></strong>, {date}, in <strong><em><Link to={`/magazine/${magazineId}`} className="magazine-link">{magazineTitle}</Link></em></strong>
      </small>
    </div>
  );
};

export default HiloContent;
