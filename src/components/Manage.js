import {useContext} from "react"
import {BlockContext} from "./BlockHandler"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSeedling, faFacePensive} from "@fortawesome/pro-solid-svg-icons"

export default function Manage(props) {
    const {ownRadish} = useContext(BlockContext)

    if (ownRadish === null) {
        return (
            <div
                className="text-center relative block max-w-3xl px-32 rounded-lg border-2 border-dashed border-gray-400 p-12 text-center hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <FontAwesomeIcon icon={faFacePensive} className="h-8 w-8 m-auto text-primary" aria-hidden="true"/>
                <h3 className="mt-2 text-sm font-medium text-gray-900">You do not currently own a Radish</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                <div className="mt-6">
                    <button className="btn btn-accent bg-rose-600 border-rose-600 text-white opacity-75"
                            onClick={() => props.changeTab('launch')}
                    >
                        <FontAwesomeIcon icon={faSeedling} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                        Plant Radish
                    </button>
                </div>
            </div>
        )
    }

}