import React, { createContext, useContext, useState, useEffect } from 'react';

const ApplicationContext = createContext();

export const useApplication = () => {
  return useContext(ApplicationContext);
};

export const ApplicationProvider = ({ children }) => {
  const [filter, setFilter] = useState('');
  const [order, setOrder] = useState('');
  const [token, setToken] = useState(null);
  const [comments_order, setComments_order] = useState('');
  const [userId, setUserId] = useState();

  return (
    <ApplicationContext.Provider value={{ filter, setFilter, order, setOrder, comments_order, setComments_order, token, setToken, userId, setUserId}}>
      {children}
    </ApplicationContext.Provider>
  );
};
