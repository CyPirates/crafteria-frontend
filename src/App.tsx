import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import { GlobalStyle } from './styles/GlobalStyles';
import TopNavBar from './components/layout/TopNavBar';
import HomePage from './pages/HomePage';
import DesignMarket from './pages/DesignMarketPage';
import ScrollToTop from './components/layout/ScrollToTop';
import MyDesignPage from './pages/MyDesignPage';


const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <div className="App">
          <ScrollToTop/>
          <TopNavBar />
          <ContentContainer>
            <Routes>
              <Route path='/' element={<Navigate to="/home" />} />
              <Route path='/home' element={<HomePage />} />
              <Route path='/designMarket' element={<DesignMarket/>} />
              <Route path='/myDesign' element={<MyDesignPage/>} />
            </Routes>
          </ContentContainer>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

const ContentContainer = styled.div`
    margin-top: 50px;
    min-width: 1000px;
    overflow-x: auto;
`
