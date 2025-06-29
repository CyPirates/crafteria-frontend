import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import CreateReviewPage from "./pages/CreateReviewPage";
import AboutPage from "./pages/AboutPage";
import { CartProvider } from "./hooks/useCart";
import SearchResultPage from "./pages/SearchResultPage";
import MyOrderPage from "./pages/MyOrderPage";
import LoginPage from "./pages/LoginPage";
import BottomBar from "./components/layout/BottomBar";
import MyPage from "./pages/MyPage";
import PoliciesPage from "./pages/PoliciesPage";
import CouponBoxPage from "./pages/CouponBoxPage";

const AppRoutes: React.FC = () => {
    const location = useLocation();
    const isLight = useSelector((state: RootState) => state.theme.isLight);

    return (
        <ThemeProvider theme={isLight ? lightTheme : darkTheme}>
            <GlobalStyle />
            <ScrollToTop />
            <Routes>
                <Route path="/coupon" element={<CouponBoxPage />} />
                {/* 레이아웃 적용되는 페이지들 */}
                <Route
                    path="*"
                    element={
                        <>
                            {location.pathname !== "/login" && <TopNavBar />}
                            <ContentContainer>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/home" />} />
                                    <Route path="/home" element={<HomePage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/design-market" element={<DesignMarket />} />
                                    <Route path="/my-design" element={<MyDesignPage />} />
                                    <Route path="/design/:id" element={<DesignDetailPage />} />
                                    <Route path="/sell-design" element={<SellDesignPage />} />
                                    <Route path="/print-order" element={<MakeOrderPage />} />
                                    <Route path="/auth/success" element={<GetTokenPage />} />
                                    <Route path="/my-order" element={<MyOrderPage />} />
                                    <Route path="/createReview/:id" element={<CreateReviewPage />} />
                                    <Route path="/company-detail/:id" element={<AboutPage />} />
                                    <Route path="/search" element={<SearchResultPage />} />
                                    <Route path="/my-page" element={<MyPage />} />
                                    <Route path="/policies/:type" element={<PoliciesPage />} />
                                </Routes>
                            </ContentContainer>
                            {location.pathname !== "/login" && <BottomBar />}
                        </>
                    }
                />
            </Routes>
        </ThemeProvider>
    );
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <CartProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </CartProvider>
        </Provider>
    );
};

export default App;

const ContentContainer = styled.div`
    width: 1300px;
    max-width: 1300px;
    margin: 80px auto 0;
    min-height: calc(100vh - 50px);
`;
