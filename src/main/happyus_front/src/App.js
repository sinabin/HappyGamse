import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
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
            </Routes>
        </BrowserRouter>

    );

}

export default App;