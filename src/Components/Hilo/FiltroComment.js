import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { FilterTwoTone } from '@ant-design/icons';
import './FiltroComment.css';

const FiltroComment = ({ selectedFilter, onFilterChange }) => {
  const menu = (
    <Menu>
      <Menu.Item 
        className={`filter-button ${selectedFilter === 'newest' ? 'active' : ''}`}
        onClick={() => onFilterChange('newest')}
      >
        Newest
      </Menu.Item>
      <Menu.Item 
        className={`filter-button ${selectedFilter === 'older' ? 'active' : ''}`}
        onClick={() => onFilterChange('older')}
      >
        Older
      </Menu.Item>
      <Menu.Item 
        className={`filter-button ${selectedFilter === 'top' ? 'active' : ''}`}
        onClick={() => onFilterChange('top')}
      >
        Top
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="filtro-comment">
      <Dropdown overlay={menu} trigger={['hover']}>
        <Button className="filter-dropdown-button" icon={<FilterTwoTone />}>
          Filtrar comentarios
        </Button>
      </Dropdown>
    </div>
  );
};

export default FiltroComment;
