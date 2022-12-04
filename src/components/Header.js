import icon from "../data/icon.png"
import {useContext} from "react"
import {BlockContext} from "./BlockHandler"
import {NavLink} from "react-router-dom"

export default function Header({pathname}) {
    const {address, connect, network, networkID} = useContext(BlockContext)

    let buttonContent = "Connect"

    if (address !== null) {
        buttonContent = "0x..." + address.substring(address.length - 6, address.length)
    }

    const networkHighlight = () => {
        if (network && network.chainId !== networkID) {
            return (
                <button className="btn btn-error">Wrong Network</button>
            )
        }
    }

    return (
        <header className="flex justify-between gap-4 p-4">
            <div className="flex justify-start w-96">
                <img src={icon} className="h-10" alt="icon"/>
            </div>

            <div className="tabs tabs-boxed h-fit">
                <NavLink to="/" className={pathname === '/' ? "tab tab-active" : "tab"}>
                    Home
                </NavLink>
                <NavLink to="/explore" className={pathname === '/explore' ? "tab tab-active" : "tab"}>
                    Explorer
                </NavLink>
                <NavLink to="/launch" className={pathname === '/launch' ? "tab tab-active" : "tab"}>
                    Launch Project
                </NavLink>
                <NavLink to="/manage" className={pathname === '/manage' ? "tab tab-active" : "tab"}>
                    Manage Project
                </NavLink>
                <NavLink to="/watered" className={pathname === '/watered' ? "tab tab-active" : "tab"}>
                    Funded Projects
                </NavLink>
            </div>

            <div className="flex justify-end gap-2 w-96">
                {networkHighlight()}
                <button className="btn btn-primary btn-md w-32" onClick={connect}>{buttonContent}</button>
            </div>
        </header>
    )
}