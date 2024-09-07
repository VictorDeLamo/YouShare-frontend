import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hilo from './Pages/Hilo/HiloPage';
import HilosList from './Pages/HilosList/HilosListPage';
import Magazine from './Pages/Magazine/MagazinePage';
import MagazineCreate from './Pages/MagazineCreate/MagazineCreatePage';
import MagazineUpdate from './Pages/MagazineUpdatePage/MagazineUpdatePage';
import MagazineList from './Pages/MagazinesList/MagazineListPage';
import User from './Pages/User/UserPage';
import UserEdit from './Pages/UserEdit/UserEditPage';
import { ApplicationProvider } from './Utils/applicationProvider';
import HiloCreate from './Pages/HiloCreate/HiloCreatePage';
import LinkCreate from './Pages/LinkCreate/LinkCreatePage';
import { CurrentUserProvider } from './Utils/currentUserProvider';
import Search from './Pages/Search/SearchPage';
import { CallsProvider } from './Utils/callsProvider';

function App() {
  return (
    <ApplicationProvider>
      <CurrentUserProvider>
        <CallsProvider>
    <div className="container">
      <Router>
        <Routes>
          <Route exact path="/" element={<HilosList />} />
          <Route exact path="/hilos/new" element={<HiloCreate />} />
          <Route exact path="/links/new" element={<LinkCreate />} />
          <Route path="/hilo/:id" element={<Hilo />} />
          <Route path="/magazine/:id" element={<Magazine />} />
          <Route path="/magazineList" element={<MagazineList />} />
          <Route path="/magazines/new" element={<MagazineCreate />} />
          <Route path="/magazines/:id/edit" element={<MagazineUpdate />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/user/:id/edit" element={<UserEdit />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </div>
        </CallsProvider>
      </CurrentUserProvider>
    </ApplicationProvider>
  );
}

export default App;
