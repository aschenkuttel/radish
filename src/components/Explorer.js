import {BlockContext} from "./BlockHandler"
import {BigNumber} from "ethers"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faDroplet} from "@fortawesome/pro-solid-svg-icons"
import BaseExplorer from "./BaseExplorer"

export default class Explorer extends BaseExplorer {
    static contextType = BlockContext

    generateRows = () => {
        const rows = []
        let row = []

        for (let i = 0; i < this.context.radishes.length; i++) {
            const radish = this.context.radishes[i]
            row.push(this.generateCard(radish, i))

            if (row.length === 3) {
                rows.push([...row])
                row = []
            }
        }

        if (row.length > 0) {
            rows.push([...row])
        }

        return rows.map((row, index) => {
            return (
                <div key={index} className="w-full flex gap-4">
                    {row[0]}
                    {row[1]}
                    {row[2]}
                </div>
            )
        })
    }

    generateCard = (radish, index) => {
        const percentageReached = radish.fulfilledAmount.mul(BigNumber.from(100).div(radish.hardCap))
        const disabled = radish.startTime > new Date() || new Date() > radish.endTime

        return (
            <div key={index} className="card max-w-lg shadow-xl">
                <figure className="bg-base-200"><img src={radish.photoUrl} className="project-icon" alt="Project Icon"/>
                </figure>
                <div className="card-body">
                    <p className="text-2xl font-bold font-mono">{radish.tokenName}</p>
                    <p className="text-sm">{radish.description || "Missing Description"}</p>

                    <div className="divider !mb-0"></div>

                    <div className="flex justify-between gap-2 text-sm">
                        {this.generateCountdown(radish)}
                    </div>

                    <div className="divider !mt-0"></div>

                    <div className="flex justify-between gap-2 text-sm">
                        <p className="font-bold text-primary">CONTRIBUTION RANGE</p>
                        <p className="text-end">
                            <span>{radish.readable('minimumContribution')}</span>
                            -
                            <span>{radish.readable('maximumContribution')}</span>
                            <span>{` ${radish.fundingSymbol}`}</span>
                        </p>
                    </div>

                    <progress className="progress progress-primary w-full bg-white shadow"
                              value={percentageReached.toString()} max="100"></progress>

                    <div className="flex justify-between gap-2 text-sm">
                        <p className="font-bold text-primary">SOFTCAP TO HARDCAP</p>
                        <p className="text-end">
                            <span>{radish.readable('softCap')}</span>
                            -
                            <span>{radish.readable('hardCap')}</span>
                            <span>{` ${radish.fundingSymbol}`}</span>
                        </p>
                    </div>

                    <div className="divider"></div>

                    <div className="flex justify-between items-center gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="font-bold mt-1 text-primary">LOCKED TILL:</span>
                            <span
                                className="font-medium text-black">{radish.readable('lockedTill')}</span>
                        </div>
                        <button className="btn btn-primary text-white bg-sky-700 hover:bg-sky-800 border-sky-700 hover:border-sky-800" disabled={disabled}>
                            <FontAwesomeIcon icon={faDroplet} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Water Radish
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="flex flex-col gap-4">
                {this.generateRows()}
            </div>
        )
    }
}