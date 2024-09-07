import React, { useEffect, useState } from 'react';
import ListElement from './ListElement/ListElement';
import { Empty } from 'antd';
import { apiCall } from '../../Utils/api'; // Ajusta la ruta según sea necesario
import './HilosList.css';
import { useApplication } from '../../Utils/applicationProvider';

const HilosList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const { filter, order } = useApplication();

  const fetchPosts = async () => {
    try {
      const params = { filter, order };
      const postsData = await apiCall('/hilos', 'GET', params);
      setPosts(postsData);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter, order]);

  return (
    <div className="hilos-list">
      {error ? (
        <div className="error">Error: {error}</div>
      ) : posts.length > 0 ? (
        posts.map(post => (
          <ListElement
            key={post.id}
            id={post.id}
            title={post.title}
            link={post.url}
            author={post.propietario.username || 'Unknown'}
            date={new Date(post.created_at).toLocaleDateString() + ' ' + new Date(post.created_at).toLocaleTimeString()}
            comments={post.comments_count || 0}
            content={post.content}
            likes={post.likes}
            dislikes={post.dislikes}
            boostsCount={post.boosts_count}
            fetchPosts={fetchPosts} // Pasa la función fetchPosts como propiedad
            magazineId={post.magazine.id}
            magazineTitle={post.magazine.title}
            userId={post.propietario.id}
          />
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};

export default HilosList;
