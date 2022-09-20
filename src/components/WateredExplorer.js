import BaseExplorer from "./BaseExplorer"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUnlock, faClock, faFacePensive, faDroplet} from "@fortawesome/pro-solid-svg-icons";

export default class WateredExplorer extends BaseExplorer {
    componentDidMount() {
        this.setIterable([this.context.wateredRadishes])
        this.toggleCountdown(false)
        super.componentDidMount();
    }

    modal = () => {}

    generateCard = (radish, index) => {
        return (
            <div key={index} className="card w-card shadow-xl">
                <figure className="bg-base-200"><img src={radish.photoUrl} className="project-icon" alt="Project Icon"/>
                </figure>
                <div className="card-body">
                    <p className="text-2xl text-center font-bold font-mono">{radish.displayName}</p>
                    <p className="text-sm text-center ">{radish.description || "Missing Description"}</p>

                    <div className="divider"></div>

                    <div className="text-sm text-center">
                        <div className="flex flex-col">
                            <span className="font-bold mt-1 text-primary">LOCKED TILL:</span>
                            <span
                                className="font-medium text-black">{radish.readable('lockedTill')}</span>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-2xl font-bold font-mono">VOTE</p>

                        <button className="btn btn-primary w-fit text-white"
                                disabled={radish.currentVote === 'duration'}>
                            <FontAwesomeIcon icon={faClock} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Increase Duration
                        </button>

                        <button className="btn"
                                disabled={radish.currentVote === 'withdraw'}>
                            <FontAwesomeIcon icon={faUnlock} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Withdraw Liquidity
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if (this.context.wateredRadishes) {
            return super.render();
        } else {
            return (
                <div
                    className="text-center relative block max-w-3xl px-32 rounded-lg border-2 border-dashed border-gray-400 p-12 text-center hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <FontAwesomeIcon icon={faFacePensive} className="h-8 w-8 m-auto text-primary" aria-hidden="true"/>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">You did not water a Radish yet!</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by funding a project...</p>
                    <div className="mt-6">
                        <button className="btn btn-primary text-white bg-sky-700 hover:bg-sky-800 border-sky-700 hover:border-sky-800"
                                onClick={() => this.props.changeTab('explorer')}>
                            <FontAwesomeIcon icon={faDroplet} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Plant Radish
                        </button>
                    </div>
                </div>
            )
        }

    }
}