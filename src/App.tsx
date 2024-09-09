import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";

import { GlobalStyle } from "./styles/GlobalStyles";
import TopNavBar from "./components/layout/TopNavBar";
import HomePage from "./pages/HomePage";
import DesignMarket from "./pages/DesignMarketPage";
import ScrollToTop from "./components/layout/ScrollToTop";
import MyDesignPage from "./pages/MyDesignPage";
import DesignDetailPage from "./pages/DesignDetailPage";
import SellDesignPage from "./pages/SellDesignPage";
import PrintOrderPage from "./pages/PrintOrderPage";
import GetTokenPage from "./pages/GetTokenPage";

const App: React.FC = () => {
    return (
        <>
            <GlobalStyle />
            <BrowserRouter>
                <div className="App">
                    <ScrollToTop />
                    <TopNavBar />
                    <ContentContainer>
                        <Routes>
                            <Route path="/" element={<Navigate to="/home" />} />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/design-market" element={<DesignMarket />} />
                            <Route path="/my-design" element={<MyDesignPage />} />
                            <Route path="/design/:id" element={<DesignDetailPage />} />
                            <Route path="/sell-design" element={<SellDesignPage />} />
                            <Route path="/print-order" element={<PrintOrderPage />} />
                            <Route path="/auth/success" element={<GetTokenPage />} />
                        </Routes>
                    </ContentContainer>
                </div>
            </BrowserRouter>
        </>
    );
};

export default App;

const ContentContainer = styled.div`
    width: 1300px;
    margin: 50px auto 0;
    overflow-x: hidden;
`;
