import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, MailOutlined, PlusOutlined, UserOutlined, CopyOutlined, LinkOutlined, ReadOutlined } from '@ant-design/icons';
import { Menu, Button, Dropdown, Input } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApplication } from '../../Utils/applicationProvider';
import './NavBar.css';

const { Search } = Input;

const navigationItems = [
  {
    label: (
      <Link to="/">
        Hilos
      </Link>
    ),
    key: '/',
    icon: <AppstoreOutlined />,
  },
  {
    label: (
      <Link to="/magazineList">
        Revistas
      </Link>
    ),
    key: '/magazineList',
    icon: <ReadOutlined />,
  },
];

const creationItems = [
  {
    label: (
      <Link to="/links/new">
        Link
      </Link>
    ),
    key: 'link',
    icon: <LinkOutlined />,
  },
  {
    label: (
      <Link to="/hilos/new">
        Hilo
      </Link>
    ),
    key: 'hilo',
    icon: <MailOutlined />,
  },
  {
    label: (
      <Link to="/magazines/new">
        Revista
      </Link>
    ),
    key: 'revista',
    icon: <ReadOutlined />,
  },
];

const loginItems = [
  {
    label: "Albert",
    key: '985b910bbc5765e5a4f8fa46f00a9a98ad3e2fea4318e3fcc0088a42f7c25885',
    icon: <UserOutlined />,
  },
  {
    label: "Jose",
    key: 'da649e6181bbe94ecabcaeeb7775c36b0295ac45a281d854e4937a276c799b82',
    icon: <UserOutlined />,
  },
];

const menuProps = {
  items: creationItems,
  onClick: () => {},
};

const NavBar = () => {
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  const { token, setToken, setUserId } = useApplication();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const handleMenuClick = ({ key }) => {
    const userId = (key === '985b910bbc5765e5a4f8fa46f00a9a98ad3e2fea4318e3fcc0088a42f7c25885') ? 1 : 7;
    setUserId(userId);
    setToken(key);
    console.log(token);
    navigate(`/user/${userId}`); // Navega a la página del usuario
  };

  const onSearch = (value, _e, info) => {
    navigate(`/search?query=${encodeURIComponent(value)}`, { replace: true });
  };

  return (
    <div className="navbar">
      <div className="navbar-title">youShare</div>
      <div className="menu-and-search">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={navigationItems}
        className="menu"
      />
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
        </div>
      <div className="loginButton">
        <Dropdown menu={menuProps}>
          <Button shape="circle" icon={<PlusOutlined />} />
        </Dropdown>
        <Dropdown overlay={<Menu items={loginItems} onClick={handleMenuClick} />}>
          <Button shape="circle" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </div>
  );
};

export default NavBar;
