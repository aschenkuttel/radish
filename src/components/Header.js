import icon from "../data/icon.png"
import {useContext} from "react"
import {BlockContext} from "./BlockHandler"

export default function Header(props) {
    const {address, connect} = useContext(BlockContext)

    let buttonContent = "Connect"

    if (address !== null) {
        buttonContent = "0x..." + address.substring(address.length - 6, address.length)
    }

    return (
        <header className="flex justify-between gap-4 p-4">
            <div className="flex justify-center w-32">
                <img src={icon} className="h-10" alt="icon"/>
            </div>

            <div className="tabs tabs-boxed h-fit">
                <button className={props.activeTab === 'explorer' ? "tab tab-active" : "tab"}
                        onClick={() => props.setActiveTab('explorer')}>Explorer</button>
                <button className={props.activeTab === 'launch' ? "tab tab-active" : "tab"}
                        onClick={() => props.setActiveTab('launch')}>Launch Project</button>
                <button className={props.activeTab === 'manage' ? "tab tab-active" : "tab"}
                        onClick={() => props.setActiveTab('manage')}>Manage Projects</button>
                <button className={props.activeTab === 'funded' ? "tab tab-active" : "tab"}
                        onClick={() => props.setActiveTab('funded')}>Funded Projects</button>
            </div>

            <button className="btn btn-primary btn-md w-32" onClick={connect}>{buttonContent}</button>
        </header>
    )
}