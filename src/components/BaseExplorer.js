import {Component, Fragment} from "react"
import {Countdown} from "react-daisyui"
import {BlockContext} from "./BlockHandler"

export default class BaseExplorer extends Component {
    static contextType = BlockContext

    constructor(props, context) {
        super(props)

        this.intervalID = null
        this.iterable = null

        this.state = {
            countdowns: {}
        }
    }

    setIterable = (iterable) => {
        this.iterable = iterable
    }

    updateCountdowns = () => {
        const countdowns = {}
        const now = new Date()

        for (const radish of this.iterable || this.context.radishes) {
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

    componentDidMount() {
        if (this.context?.radishes && this.intervalID === null) {
            this.intervalID = setInterval(this.updateCountdowns, 1000)
        }
    }
}