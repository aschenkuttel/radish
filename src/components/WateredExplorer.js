import BaseExplorer from "./BaseExplorer"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUnlock, faClock} from "@fortawesome/pro-solid-svg-icons";

export default class WateredExplorer extends BaseExplorer {
    componentDidMount() {
        this.setIterable([this.context.wateredRadishes])
        this.toggleCountdown(false)
        super.componentDidMount();
    }

    generateCard = (radish, index) => {
        return (
            <div key={index} className="card w-card shadow-xl">
                <figure className="bg-base-200"><img src={radish.photoUrl} className="project-icon" alt="Project Icon"/>
                </figure>
                <div className="card-body">
                    <p className="text-2xl font-bold font-mono">{radish.tokenName}</p>
                    <p className="text-sm">{radish.description || "Missing Description"}</p>

                    <div className="divider"></div>

                    <div className="flex justify-between items-center gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="font-bold mt-1 text-primary">LOCKED TILL:</span>
                            <span
                                className="font-medium text-black">{radish.readable('lockedTill')}</span>
                        </div>
                    </div>

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

}