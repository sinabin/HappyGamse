import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import Header from "./Components/Header";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {faFontAwesome, faTwitter} from '@fortawesome/free-brands-svg-icons'
import NewsPage from "./Pages/NewsPage";
import Friend from "./Pages/Friend";

library.add(fas, faTwitter, faFontAwesome)

function App(){
    return (
        <BrowserRouter>
            <Header>
            </Header>
            <Routes>
                <Route path ="/news" exact={true} element={<NewsPage />} ></Route>
                <Route path ="/topic" exact={true} element={<NewsPage />} ></Route>
                <Route path ="/event" exact={true} element={<NewsPage />} ></Route>
                <Route path ="/friend" exact={true} element={<Friend />} ></Route>
            </Routes>
        </BrowserRouter>

    );

}

export default App;