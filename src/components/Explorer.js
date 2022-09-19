import {Component, Fragment} from "react"
import {BlockContext} from "./BlockHandler"
import {BigNumber} from "ethers"
import {Countdown} from "react-daisyui"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faDroplet} from "@fortawesome/pro-solid-svg-icons"

export default class Explorer extends Component {
    static contextType = BlockContext

    constructor(props) {
        super(props)

        this.intervalID = null

        this.state = {
            countdowns: {}
        }
    }

    updateCountdowns = () => {
        const countdowns = {}
        const now = new Date()

        for (const radish of this.context.radishes) {
            let secDifference = 0
            let title = "OPEN TILL:"
            if (radish.startTime > now) {
                secDifference = Math.round((radish.startTime - now) / 1000)
                title = "STARTING IN:"
            } else {
                secDifference = Math.round((radish.endTime - now) / 1000)
            }

            if (secDifference < 0) {
                countdowns[radish.tokenAddress] = [0, 0, 0, "LAUNCH OVER"]
            } else {
                const hours = Math.floor(secDifference / 3600);
                secDifference -= (hours * 3600)
                const minutes = Math.floor(secDifference / 60);
                const seconds = secDifference -= (minutes * 60)

                countdowns[radish.tokenAddress] = [hours, minutes, seconds, title]
            }
        }

        this.setState({countdowns: countdowns})
    }

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

    generateCountdown = (radish) => {
        const countdown = this.state.countdowns[radish.tokenAddress]
        if (!countdown) {
            return <span className="font-medium text-2xl font-mono opacity-0">DONT JUDGE US</span>
        }

        if (radish.successfull) {
            return (
                <p className="font-medium text-2xl font-mono text-success-content">LAUNCH SUCCESSFUL</p>
            )

        } else return (
                <Fragment>
                    <p className="font-medium text-2xl font-mono">{countdown[3]}</p>
                    <span className="font-mono text-2xl">
                        <Countdown value={countdown[0]}/>:
                        <Countdown value={countdown[1]}/>:
                        <Countdown value={countdown[2]}/>
                    </span>
                </Fragment>
            )
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
                            Fund Project
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if (this.context?.radishes && this.intervalID === null) {
            this.intervalID = setInterval(this.updateCountdowns, 1000)
        }

        return (
            <div className="flex flex-col gap-4">
                {this.generateRows()}
            </div>
        )
    }
}