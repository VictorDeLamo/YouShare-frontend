// src/Components/Layout/NavBar2.js
import { Menu, Button, Dropdown,  } from 'antd';
import React, { useEffect, useState } from 'react';

import './NavBar2.css';
import { AppstoreOutlined, FilterFilled, FieldTimeOutlined, MailOutlined, LinkOutlined, UpOutlined } from '@ant-design/icons';
import { useApplication } from '../../Utils/applicationProvider';

const NavBar2 = () => {

  const { filter, setFilter, order, setOrder } = useApplication();

  const params = {
    filter: filter,
    order: order
  };

  const handleOrder = (e) => {
    setOrder(e.key);
  };

  const handleFilter = (e) => {
    setFilter(e.key);
  };

  const navigationItems = [
    {
      label: 'Top',
      key: 'top',
      icon: <UpOutlined /> ,
    },
    {
      label: 'Newest',
      key: 'newest',
      icon: <FieldTimeOutlined />,
    },
    {
      label: 'Commented',
      key: 'commented',
      icon: <MailOutlined />,
    },
    
  ];

  const filterItems = [
    {
      label: 'Hilos',
      key: 'hilos',
      icon: <AppstoreOutlined />,
    },
    {
      label: 'Links',
      key: 'links',
      icon: <LinkOutlined />,
    },
    {
      label: 'All',
      key: '',
      icon: <MailOutlined />,
    },
  ];

  const filterProps = {
    items: filterItems,
    onClick: handleFilter,
  };

  return (
    <div className="navbar2">
      <Menu onClick={handleOrder} selectedKeys={[order]} mode="horizontal" items={navigationItems} className="menu2"  />
      <Dropdown menu={filterProps}>
          <Button type="text" icon={<FilterFilled />} />
      </Dropdown>
    </div>
  );
};

export default NavBar2;
