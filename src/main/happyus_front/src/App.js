import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import Header from "./Components/Header";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {faFontAwesome, faTwitter} from '@fortawesome/free-brands-svg-icons'

library.add(fas, faTwitter, faFontAwesome)

function App(){
    return (
        <BrowserRouter>
            <Header>
            </Header>
            <Routes>
                <Route path ="/" exact={true} element={<HomePage />} ></Route>
                <Route path ="/home" exact={true} element={<HomePage />} ></Route>
                <Route path ="/signup" exact={true} element={<SignUpPage />} ></Route>
            </Routes>
        </BrowserRouter>

    );

}

export default App;