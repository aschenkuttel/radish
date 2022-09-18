import './App.css';
import {Fragment, useState} from "react"
import Header from "./components/Header"
import Creator from "./components/Creator"

function App() {
    const [activeTab, setActiveTab] = useState('explorer')

    const getTabContent = () => {
        if (activeTab === 'launch') {
            return <Creator/>
        } else if (activeTab === 'manage') {
            return <div></div>
        } else {
            return <div></div>//<Explorer/>
        }
    }

    return (
        <Fragment>
            <Header activeTab={activeTab} setActiveTab={setActiveTab}></Header>
            <div className="flex flex-col justify-center items-center">
                {getTabContent()}
            </div>
        </Fragment>
    );
}

export default App;
