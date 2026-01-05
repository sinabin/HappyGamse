import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Header from "./Common/Header";
import ProtectedRoute from "./Common/ProtectedRoute";
import ErrorBoundary from "./Common/ErrorBoundary";
import LoadingSpinner from "./Common/LoadingSpinner";
import { AriaLiveRegion } from "./utils/accessibility";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {faFontAwesome, faTwitter} from '@fortawesome/free-brands-svg-icons'

// Eager-loaded components (critical for initial render)
import LoginPage from "./Pages/AuthPage/LoginPage";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";

// Lazy-loaded components (code splitting for better performance)
// Auth Pages
const SignUpPage = lazy(() => import("./Pages/AuthPage/SignUpPage"));
const AgreementPage = lazy(() => import("./Pages/AuthPage/AgreementPage"));
const FindAccountPage = lazy(() => import("./Pages/AuthPage/FindAccountPage"));

// Service Pages
const NewsList = lazy(() => import("./Pages/NewsPage/NewsList"));
const NewsDetail = lazy(() => import("./Pages/NewsPage/NewsDetail"));
const ChannelList = lazy(() => import("./Pages/ChannelPage/./ChannelList"));
const ChannelDetail = lazy(() => import("./Pages/ChannelPage/ChannelDetail"));
const MyPage = lazy(() => import("./Pages/MyPage/MyPage"));
const CommunityMain = lazy(() => import("./Pages/CommunityPage/CommunityMain"));
const CommunityList = lazy(() => import("./Pages/CommunityPage/CommunityList"));
const PostDetail = lazy(() => import("./Pages/CommunityPage/PostDetail"));
const EditPost = lazy(() => import("./Pages/CommunityPage/EditPost"));

library.add(fas, faTwitter, faFontAwesome)

function App() {
    return (
        <ErrorBoundary>
            <AriaLiveRegion />
            <BrowserRouter>
                <Header />
                <Suspense fallback={<LoadingSpinner fullScreen message="페이지를 불러오는 중..." />}>
                    <Routes>
                        {/* Public Routes - Authentication */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/agreement" element={<AgreementPage />} />
                        <Route path="/find-account" element={<FindAccountPage />} />

                        {/* Protected Routes - Require Authentication */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<ChannelList />} />
                            <Route path="/friend" element={<ChannelList />} />
                            <Route path="/user/friend/channel/:channel_id" element={<ChannelDetail />} />
                            <Route path="/news" exact={true} element={<NewsList />} />
                            <Route path="/news/detail/:news_id" element={<NewsDetail />} />
                            <Route path="/user/myPage" element={<MyPage />} />
                            <Route path="/community" element={<CommunityList />} />
                            <Route path="/community/:gameCode" element={<CommunityMain />} />
                            <Route path="/community/:gameCode/:categoryCode" element={<CommunityMain />} />
                            <Route path="/community/:gameCode/posts/detail/:post_id" element={<PostDetail />} />
                            <Route path="/user/community/:gameCode/posts/edit-post/:post_id" element={<EditPost />} />
                        </Route>

                        {/* Error Routes */}
                        <Route path="/error/:code" element={<ErrorPage />} />
                        <Route path="*" element={<ErrorPage code={404} />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
