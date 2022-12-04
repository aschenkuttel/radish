import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSeedling, faFacePensive, faShovel, faSickle} from "@fortawesome/pro-solid-svg-icons"
import {BigNumber} from "ethers"
import BaseExplorer from "./BaseExplorer"
import {NavLink} from "react-router-dom"

export default class Manage extends BaseExplorer {
    componentDidMount() {
        if (this.context.ownRadish !== null) {
            this.setIterable([this.context.ownRadish])
            this.toggleCountdown(true)
        } else {
            this.toggleCountdown(false)
        }

        super.componentDidMount();
    }

    modal = () => {}

    render = () => {
        const ownRadish = this.context.ownRadish

        if (ownRadish === null) {
            return (
                <div
                    className="text-center relative block max-w-3xl px-32 rounded-lg border-2 border-dashed border-gray-400 p-12 text-center hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <FontAwesomeIcon icon={faFacePensive} className="h-8 w-8 m-auto text-primary" aria-hidden="true"/>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">You do not currently own a Radish</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                    <div className="mt-6">
                        <NavLink to="/launch" className="btn btn-accent bg-rose-600 border-rose-600 text-white opacity-75">
                            <FontAwesomeIcon icon={faSeedling} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Plant Radish
                        </NavLink>
                    </div>
                </div>
            )
        } else {
            const percentageReached = ownRadish.fulfilledAmount.mul(BigNumber.from(100).div(ownRadish.hardCap))

            return (
                <div className="card w-card shadow-xl">
                    <figure className="bg-base-200"><img src={ownRadish.photoUrl} className="project-icon"
                                                         alt="Project Icon"/>
                    </figure>
                    <div className="card-body">
                        <p className="text-2xl text-center font-bold font-mono">{ownRadish.displayName}</p>
                        <p className="text-sm text-center">{ownRadish.description || "Missing Description"}</p>

                        <div className="divider !mb-0"></div>

                        <div className="flex justify-between gap-2 text-sm">
                            {this.generateCountdown(ownRadish)}
                        </div>

                        <div className="divider !mt-0"></div>

                        <progress className="progress progress-primary w-full bg-white shadow"
                                  value={percentageReached.toString()} max="100"></progress>

                        <div className="flex justify-between gap-2 text-sm">
                            <p className="font-bold text-primary">SOFTCAP TO HARDCAP</p>
                            <p className="text-end">
                                <span>{ownRadish.readable('softCap')}</span>
                                -
                                <span>{ownRadish.readable('hardCap')}</span>
                                <span>{` ${ownRadish.fundingSymbol}`}</span>
                            </p>
                        </div>

                        <div className="divider"></div>

                        <div className="flex justify-between items-center gap-4 text-sm">
                            <button
                                className="btn text-white" disabled={false} onClick={async () => {
                                    await this.context.pluckRadish(ownRadish)
                                }}>
                                <FontAwesomeIcon icon={faShovel} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                                Pluck Radish
                            </button>

                            <button
                                className="btn btn-primary text-white"
                                disabled={ownRadish.endTime < new Date() || ownRadish.fulfilledAmount.lt(ownRadish.softCap)}>
                                <FontAwesomeIcon icon={faSickle} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                                Harvest Radish
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}