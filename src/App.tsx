import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./store/store";

import { lightTheme, darkTheme } from "./theme/theme";
import { GlobalStyle } from "./styles/GlobalStyles";
import TopNavBar from "./components/layout/TopNavBar";
import HomePage from "./pages/HomePage";
import DesignMarket from "./pages/DesignMarketPage";
import ScrollToTop from "./components/layout/ScrollToTop";
import MyDesignPage from "./pages/MyDesignPage";
import DesignDetailPage from "./pages/DesignDetailPage";
import SellDesignPage from "./pages/SellDesignPage";
import MakeOrderPage from "./pages/MakeOrderPage";
import GetTokenPage from "./pages/GetTokenPage";
import MyPage from "./pages/MyPage";
import CreateReviewPage from "./pages/CreateReviewPage";
import AboutPage from "./pages/AboutPage";
import { CartProvider } from "./hooks/useCart";
import SearchResultPage from "./pages/SearchResultPage";

const App: React.FC = () => {
    const isLight = useSelector((state: RootState) => state.theme.isLight);
    return (
        <>
            <CartProvider>
                <ThemeProvider theme={isLight ? lightTheme : darkTheme}>
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
                                    <Route path="/print-order" element={<MakeOrderPage />} />
                                    <Route path="/auth/success" element={<GetTokenPage />} />
                                    <Route path="/my-page" element={<MyPage />} />
                                    <Route path="/createReview/:id" element={<CreateReviewPage />} />
                                    <Route path="/company-detail/:id" element={<AboutPage />} />
                                    <Route path="/search" element={<SearchResultPage />} />
                                </Routes>
                            </ContentContainer>
                        </div>
                    </BrowserRouter>
                </ThemeProvider>
            </CartProvider>
        </>
    );
};

const Root: React.FC = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

export default Root;

const ContentContainer = styled.div`
    width: 1300px;
    margin: 50px auto 0;
`;
