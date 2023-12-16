import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import Header from "./Components/Header";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {faFontAwesome, faTwitter} from '@fortawesome/free-brands-svg-icons'
import NewsListPage from "./Pages/NewsPage/NewsListPage";
import NewsDetailPage from "./Pages/NewsPage/NewsDetailPage";
import ChannelListPage from "./Pages/ChannelPage/ChannelListPage";
import ChannelDetailPage from "./Pages/ChannelPage/ChannelDetailPage";
import MyPage from "./Pages/MyPage/MyPage"
library.add(fas, faTwitter, faFontAwesome)

function App(){
    return (
        <BrowserRouter>
            <Header>
            </Header>
            <Routes>
                <Route path="/" element={<ChannelListPage />} />
                <Route path="/friend" element={<ChannelListPage />} />
                <Route path="/friend/channel/:channel_id" element={<ChannelDetailPage />} />
                <Route path ="/news" exact={true} element={<NewsListPage />} />
                <Route path="/news/detail/:news_id" element={<NewsDetailPage />} />
                <Route path="/myPage" element={<MyPage />} />
            </Routes>
        </BrowserRouter>

    );

}

export default App;