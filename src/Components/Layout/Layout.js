import React from 'react';
import NavBar from './NavBar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <NavBar />
      
      <main>{children}</main>
    </div>
  );
};

export default Layout;