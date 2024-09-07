import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApplication } from './applicationProvider';
import { apiCall } from './api';
import { message } from 'antd';

const CurrentUserContext = createContext();

export const useCurrentUser = () => {
  return useContext(CurrentUserContext);
};

export const CurrentUserProvider = ({ children }) => {
  const { userId } = useApplication();

  const [likedItemsUser1, setLikedItemsUser1] = useState(new Set());
  const [boostedItemsUser1, setBoostedItemsUser1] = useState(new Set());
  const [dislikedItemsUser1, setDislikedItemsUser1] = useState(new Set());

  const [likedItemsUser2, setLikedItemsUser2] = useState(new Set());
  const [boostedItemsUser2, setBoostedItemsUser2] = useState(new Set());
  const [dislikedItemsUser2, setDislikedItemsUser2] = useState(new Set());

  const [ownedUser1, setOwnedUser1] = useState(new Set());
  const [ownedUser2, setOwnedUser2] = useState(new Set());

  const [user, setUser] = useState(1); 

  useEffect(() => {
    const fetchOwnedItems = async () => {
      try {
        const response = await apiCall(`/users/${userId}/hilos`, 'GET');
        const data = await response;
        const ids = data.map(hilo => hilo.id);

        if (userId === 1){
          setOwnedUser1(new Set(ids))
          setUser(1);
        } else {
          setOwnedUser2(new Set(ids));
          setUser(2);
        }

      }catch (error){
        message.error('Error fetching hilo data');

      }
    };
    if (userId != undefined) fetchOwnedItems();
  }, [userId]);

  const isLiked = (id) => {
    return (user === 1) ? likedItemsUser1.has(id) : likedItemsUser2.has(id);
  };
  const isBoosted = (id) => {
    return (user === 1) ? boostedItemsUser1.has(id) : boostedItemsUser2.has(id);
  };
  const isDisliked = (id) => {
    return (user === 1) ? dislikedItemsUser1.has(id) : dislikedItemsUser2.has(id);
  };

  const addLike = (id) => {
    if (user === 1) {
      setLikedItemsUser1((prev) => new Set(prev).add(id));
    } else {
      setLikedItemsUser2((prev) => new Set(prev).add(id));
    }
  };

  const addBoost = (id) => {
    if (user === 1) {
      setBoostedItemsUser1((prev) => new Set(prev).add(id));
    } else {
      setBoostedItemsUser2((prev) => new Set(prev).add(id));
    }
  };

  const addDislike = (id) => {
    if (user === 1) {
      setDislikedItemsUser1((prev) => new Set(prev).add(id));
    } else {
      setDislikedItemsUser2((prev) => new Set(prev).add(id));
    }
  };

  const removeLike = (id) => {
    if (user === 1) {
      setLikedItemsUser1((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      setLikedItemsUser2((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const removeBoost = (id) => {
    if (user === 1) {
      setBoostedItemsUser1((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      setBoostedItemsUser2((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const removeDislike = (id) => {
    if (user === 1) {
      setDislikedItemsUser1((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      setDislikedItemsUser2((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const isOwner = (id) => {
    return (user === 1) ? ownedUser1.has(id) : ownedUser2.has(id);
  };

  const addForOwner = (id) => {
    if (user === 1) {
      setOwnedUser1((prev) => new Set(prev).add(id));
    } else {
      setOwnedUser2((prev) => new Set(prev).add(id));
    }
  };

  return (
    <CurrentUserContext.Provider value={{ isLiked, addLike, removeLike, isBoosted, addBoost, removeBoost, isDisliked, addDislike, removeDislike, isOwner, addForOwner }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
