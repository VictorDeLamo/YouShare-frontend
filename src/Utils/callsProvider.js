import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from './api';
import { useCurrentUser } from './currentUserProvider';
import { message } from 'antd';
import { useApplication } from './applicationProvider';

const CallsContext = createContext();

export const useCalls = () => {
  return useContext(CallsContext);
};

export const CallsProvider = ({ children }) => {

  const {isLiked, addLike, removeLike, isBoosted, addBoost, removeBoost, isDisliked, addDislike, removeDislike, isOwner} = useCurrentUser();
  const { token } = useApplication();


  const handleError = (error) => {
    if (error.status === 401) {
      message.error('No has elegido usuario');
    } else if (error.status === 403) {
      message.error('No eres el propietario');
    } else if (error.status === 404) {
      message.error('Not Found');
    } else {
      message.error(`Unexpected error: ${error.message}`);
    }
  };

  const handleLike = async (id, fetchPosts) => {
    try {
      await apiCall(`/hilos/${id}/like`, 'POST', null, null, token);
      fetchPosts();
      (!isLiked(id)) ? addLike(id) : removeLike(id)
      removeDislike(id);
      
    } catch (error) {
      handleError(error);
    }
  };

  const handleDislike = async (id,fetchPosts) => {
    try {
      await apiCall(`/hilos/${id}/dislike`, 'POST', null, null, token);
      fetchPosts();
      (!isDisliked(id)) ? addDislike(id) : removeDislike(id)
      removeLike(id)
      
    } catch (error) {
      handleError(error);
    }
  };

  const handleBoost = async (id,fetchPosts) => {
    try {
      await apiCall(`/hilos/${id}/boost`, 'POST', null, null, token);
      fetchPosts();
      (!isBoosted(id)) ? addBoost(id) : removeBoost(id)
      
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteClick = async (id,fetchPosts) => {
    try {
      await apiCall(`/hilos/${id}`, 'DELETE', null, null, token);
      //fetchPosts();
      message.info('Eliminado con éxito');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <CallsContext.Provider value={{ handleLike, handleDislike, handleBoost, handleDeleteClick}}>
      {children}
    </CallsContext.Provider>
  );
};
