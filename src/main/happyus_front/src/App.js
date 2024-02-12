import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import Header from "./Components/Header";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {faFontAwesome, faTwitter} from '@fortawesome/free-brands-svg-icons'
import NewsList from "./Pages/NewsPage/NewsList";
import NewsDetail from "./Pages/NewsPage/NewsDetail";
import ChannelList from "./Pages/ChannelPage/./ChannelList";
import ChannelDetail from "./Pages/ChannelPage/ChannelDetail";
import MyPage from "./Pages/MyPage/MyPage"
import CommunityMain from "./Pages/CommunityPage/CommunityMain";
import CommunityList from "./Pages/CommunityPage/CommunityList";
import PostDetail from "./Pages/CommunityPage/PostDetail";
library.add(fas, faTwitter, faFontAwesome)

function App(){
    return (
        <BrowserRouter>
            <Header>
            </Header>
            <Routes>
                <Route path="/" element={<ChannelList />} />
                <Route path="/friend" element={<ChannelList />} />
                <Route path="/user/friend/channel/:channel_id" element={<ChannelDetail />} />
                <Route path ="/news" exact={true} element={<NewsList />} />
                <Route path="/news/detail/:news_id" element={<NewsDetail />} />
                <Route path="/user/myPage" element={<MyPage />} />
                <Route path="/community" element={<CommunityList />} />
                <Route path="/community/:gameCode" element={<CommunityMain />} />
                <Route path="/community/:gameCode/:categoryCode" element={<CommunityMain />} />
                <Route path="/community/:gameCode/posts/detail/:post_id" element={<PostDetail />} />
            </Routes>
        </BrowserRouter>

    );

}

export default App;