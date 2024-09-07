import React from 'react';
import Layout from '../../Components/Layout/Layout';
import HilosList from '../../Components/HilosList/HilosList';
import NavBar2 from '../../Components/Layout/NavBar2';

const HilosListPage = () => {
  return (
    <Layout>
      <NavBar2 />
      <HilosList />
    </Layout>
  );
};

export default HilosListPage;