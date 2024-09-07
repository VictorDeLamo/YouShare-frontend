// src/Components/Magazine/Magazine.js
import React, { useEffect, useState } from 'react';
import { apiCall } from '../../Utils/api'; // Ajusta la ruta según sea necesario
import { Empty } from 'antd';
import './Search.css';
import ListElement from '../HilosList/ListElement/ListElement';
import { useLocation } from 'react-router-dom';
import { message} from 'antd';



const Search = () => {
  const [hilos, setHilos] = useState([]);
  const [error, setError] = useState(null);

  const location = useLocation();
  

  const fetchPosts = async (query) => {
    try {
        const hilosData = await apiCall(`/search?query=${query}`, 'GET');

        setHilos(hilosData);
    } catch (error) {
      setError(error);
      message.error(error.message);
    }
  };
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    fetchPosts(query);
  }, [location]);

  return (
    <div >
      <div>
        {error ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : hilos.length > 0 ? (
          hilos.map(hilo => (
            <ListElement
            key={hilo.id}
            id={hilo.id}
            title={hilo.title}
            link={hilo.url}
            author={hilo.propietario.username || 'Unknown'}
            date={new Date(hilo.created_at).toLocaleDateString()}
            comments={hilo.comments?.length || 0}
            content={hilo.content}
            likes={hilo.likes}
            dislikes={hilo.dislikes}
            boostsCount={hilo.boosts_count}
            fetchPosts={fetchPosts} // Pasa la función fetchPosts como propiedad
            magazineId={hilo.magazine.id}
            magazineTitle={hilo.magazine.title}
            userId={hilo.propietario.id}
            />
          ))
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
};

export default Search;
