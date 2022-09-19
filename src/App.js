import './App.css';
import {Fragment, useState} from "react"
import Header from "./components/Header"
import Creator from "./components/Creator"
import Explorer from "./components/Explorer"
import Manage from "./components/Manage"
import 'flowbite'


function App() {
    const [activeTab, setActiveTab] = useState('explorer')

    const getTabContent = () => {
        if (activeTab === 'launch') {
            return <Creator changeTab={setActiveTab}/>
        } else if (activeTab === 'manage') {
            return <Manage changeTab={setActiveTab}/>
        } else {
            return <Explorer/>
        }
    }

    return (
        <Fragment>
            <Header activeTab={activeTab} setActiveTab={setActiveTab}></Header>
            <div className="w-full h-full flex flex-col justify-start items-center mt-4">
                {getTabContent()}
            </div>
        </Fragment>
    );
}

export default App;
