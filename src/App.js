import './App.css'
import {Fragment, useState} from "react"
import {Routes, Route, useLocation} from "react-router-dom"
import Header from "./components/Header"
import Creator from "./components/Creator"
import Explorer from "./components/Explorer"
import WateredExplorer from "./components/WateredExplorer"
import Manage from "./components/Manage"
import Home from "./components/Home"
import 'flowbite'


function App() {
    const location = useLocation()

    return (
        <Fragment>
            <Header pathname={location.pathname}></Header>
            <div className="w-full flex-1 flex flex-col justify-start items-center mt-4">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/explore" element={<Explorer/>}/>
                    <Route path="/launch" element={<Creator/>}/>
                    <Route path="/manage" element={<Manage/>}/>
                    <Route path="/watered" element={<WateredExplorer/>}/>
                    <Route path="*" element={<Home/>}/>
                </Routes>
            </div>
        </Fragment>
    );
}

export default App;
