import {Component, Fragment} from "react"
import {Countdown, Button, Modal, InputGroup, Input} from "react-daisyui"
import {BlockContext} from "./BlockHandler"

export default class BaseExplorer extends Component {
    static contextType = BlockContext

    constructor(props) {
        super(props)

        this.intervalID = null
        this.iterable = null
        this.countdown = true

        this.data = {}

        this.state = {
            countdowns: {},
            openModal: false
        }
    }

    setIterable = (iterable) => {
        this.iterable = iterable
    }

    toggleCountdown = (state) => {
        this.countdown = state
    }

    toggleModal = (state) => {
        this.setState({openModal: state})
    }

    modal = () => {
        throw Error("Missing Modal")
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
                countdowns[radish.address] = [0, 0, 0, "LAUNCH OVER"]
            } else {
                const hours = Math.floor(secDifference / 3600);
                secDifference -= (hours * 3600)
                const minutes = Math.floor(secDifference / 60);
                const seconds = secDifference -= (minutes * 60)

                countdowns[radish.address] = [hours, minutes, seconds, title]
            }
        }

        this.setState({countdowns: countdowns})
    }

    generateCountdown = (radish) => {
        const countdown = this.state.countdowns[radish.address]
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

    generateCard = () => {
        throw Error("missing override")
    }

    generateRows = () => {
        const iterable = this.iterable || this.context.radishes

        const rows = []
        let row = []

        for (let i = 0; i < iterable.length; i++) {
            const radish = iterable[i]
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

    componentDidMount() {
        if (this.countdown && this.context?.radishes && this.intervalID === null) {
            this.updateCountdowns()
            this.intervalID = setInterval(this.updateCountdowns, 1000)
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    render() {
        return (
            <div className="flex flex-col gap-4">
                {this.modal()}
                {this.generateRows()}
            </div>
        )
    }
}