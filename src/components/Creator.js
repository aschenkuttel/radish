import {Component} from "react"
import {parseEther} from "ethers/lib/utils"
import {BlockContext} from "./BlockHandler"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSeedling, faShovel} from "@fortawesome/pro-solid-svg-icons";
import {BigNumber} from "ethers";

export default class Creator extends Component {
    static contextType = BlockContext

    constructor(props) {
        super(props);

        function aC(number) {
            if (number < 10) {
                return "0" + number.toString()
            } else {
                return number.toString()
            }
        }

        const date = new Date()
        const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()]
        const [hour, minutes] = [date.getHours(), date.getMinutes()]
        this.placeholderDate = `${aC(year)}-${aC(month)}-${aC(day)} ${aC(hour)}:${aC(minutes)}`

        this.default = {
            tokenAddress: "",
            softCap: 0,
            hardCap: 0,
            fulfilledFunds: 0,
            minimumContribution: 0,
            maximumContribution: 0,
            startTime: this.placeholderDate,
            endTime: this.placeholderDate,
            presaleRate: 0,
            listingRate: 0,
            liquidityRate: 0,
            lockedTill: this.placeholderDate,
            file: null,
            description: ""
        }

        this.state = {...this.default}
    }

    prepareData = () => {
        return {
            tokenAddress: this.state.tokenAddress,
            softCap: parseEther(this.state.softCap),
            hardCap: parseEther(this.state.hardCap),
            fulfilledAmount: BigNumber.from(0),
            minimumContribution: parseEther(this.state.minimumContribution),
            maximumContribution: parseEther(this.state.maximumContribution),
            startTime: new Date(this.state.startTime),
            endTime: new Date(this.state.endTime),
            presaleRate: parseInt(this.state.presaleRate),
            listingRate: parseInt(this.state.listingRate),
            liquidityRate: parseInt(this.state.liquidityRate),
            lockedTill: new Date(this.state.lockedTill),
            file: this.state.file,
            description: this.state.description
        }
    }

    render() {
        return (
            <div className="card max-w-3xl bg-base-100 shadow-xl border border-base-200/100 overflow-visible">
                <div className="card-body">
                    <h2 className="card-title justify-center mb-2 text-primary text-2xl font-mono">Plant new Radish!</h2>

                    <div className="form-control flex flex-col gap-2">
                        <div className="flex-1">
                            <div className="tooltip tooltip-top"
                                 data-tip="The amount of token the user receives per Evmos in Presale">
                                <p className="font-medium ml-1">Token Address</p>
                            </div>
                            <input type="text" placeholder="0x0000000000000000000000000000000000000000"
                                   className="input input-bordered w-full" value={this.state.tokenAddress}
                                   onChange={(e) => this.setState({tokenAddress: e.target.value})}/>
                        </div>

                        <div className="tooltip tooltip-top w-full" data-tip="Project Image (2:1 Resolution)">
                            <input
                                className="block w-full text-sm text-gray-900 bg-base-100 rounded-lg border border-gray-100 cursor-pointer input-bordered"
                                id="file_input" type="file" onChange={(e) => this.setState({file: e.target.files[0]})}
                                style={{borderColor: "hsl(var(--bc) / 0.2)"}}/>
                        </div>

                        <textarea className="textarea border-base-300" placeholder="Description"
                                  value={this.state.description}
                                  onChange={(e) => this.setState({description: e.target.value})}>
                        </textarea>

                        <div className="divider"></div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <div className="tooltip tooltip-top" data-tip="Minimum amount a user can fund">
                                    <p className="font-medium ml-1">Minimum Contribution</p>
                                </div>
                                <input type="number" placeholder="Type here" className="input input-bordered w-full"
                                       value={this.state.minimumContribution}
                                       onChange={(e) => this.setState({minimumContribution: e.target.value})}/>
                            </div>
                            <div className="flex-1">
                                <div className="tooltip tooltip-top" data-tip="Maximum amount a user can fund">
                                    <p className="font-medium ml-1">Maximum Contribution</p>
                                </div>
                                <input type="number" placeholder="Type here" className="input input-bordered w-full"
                                       value={this.state.maximumContribution}
                                       onChange={(e) => this.setState({maximumContribution: e.target.value})}/>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <div className="tooltip tooltip-top"
                                     data-tip="Minimal funding amount which needs to be reached">
                                    <p className="font-medium ml-1">Soft Cap</p>
                                </div>
                                <input type="number" placeholder="Type here" className="input input-bordered w-full"
                                       value={this.state.softCap}
                                       onChange={(e) => this.setState({softCap: e.target.value})}/>
                            </div>
                            <div className="flex-1">
                                <div className="tooltip tooltip-top" data-tip="Maximal funding amount in total">
                                    <p className="font-medium ml-1">Hard Cap</p>
                                </div>
                                <input type="number" placeholder="Type here" className="input input-bordered w-full"
                                       value={this.state.hardCap}
                                       onChange={(e) => this.setState({hardCap: e.target.value})}/>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <div className="tooltip tooltip-top" data-tip="Start Date of Presale">
                                    <p className="font-medium ml-1">Start Date</p>
                                </div>
                                <input type="text" placeholder={this.placeholderDate}
                                       className="input input-bordered w-full" value={this.state.startTime}
                                       onChange={(e) => this.setState({startTime: e.target.value})}/>
                            </div>
                            <div className="flex-1">
                                <div className="tooltip tooltip-top" data-tip="End Date of Presale">
                                    <p className="font-medium ml-1">End Date</p>
                                </div>
                                <input type="text" placeholder={this.placeholderDate}
                                       className="input input-bordered w-full" value={this.state.endTime}
                                       onChange={(e) => this.setState({endTime: e.target.value})}/>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <div className="tooltip tooltip-top"
                                     data-tip="The amount of token the user receives per Evmos in Presale">
                                    <p className="font-medium ml-1">Presale Rate</p>
                                </div>
                                <input type="number" placeholder="0" className="input input-bordered w-full"
                                       value={this.state.presaleRate}
                                       onChange={(e) => this.setState({presaleRate: e.target.value})}/>
                            </div>
                            <div className="flex-1">
                                <div className="tooltip tooltip-top"
                                     data-tip="The amount of token the user receives per Evmos in Exchange">
                                    <p className="font-medium ml-1">Listing Rate</p>
                                </div>
                                <input type="number" placeholder="0" className="input input-bordered w-full"
                                       value={this.state.listingRate}
                                       onChange={(e) => this.setState({listingRate: e.target.value})}/>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <div className="tooltip tooltip-top"
                                     data-tip="The percentage of funded Evmos which will be used as liquidity">
                                    <p className="font-medium ml-1">Liquidity Rate</p>
                                </div>
                                <input type="number" placeholder="0" className="input input-bordered w-full"
                                       value={this.state.liquidityRate}
                                       onChange={(e) => this.setState({liquidityRate: e.target.value})}/>
                            </div>
                            <div className="flex-1">
                                <div className="tooltip tooltip-top"
                                     data-tip="Date till when liquidity will be definitely locked">
                                    <p className="font-medium ml-1">Locked Till</p>
                                </div>
                                <input type="text" placeholder={this.placeholderDate}
                                       value={this.state.lockedTill} className="input input-bordered w-full"
                                       onChange={(e) => this.setState({lockedTill: e.target.value})}/>
                            </div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="card-actions justify-between">
                        <button className="btn" onClick={() => {
                            this.setState({...this.default})
                        }}>
                            <FontAwesomeIcon icon={faShovel} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Reset Values
                        </button>

                        <button className="btn btn-accent bg-rose-600 border-rose-600 text-white opacity-75"
                                onClick={async () => {
                                    await this.context.plantRadish(this.prepareData())
                                    this.props.changeTab('explorer')
                                }}
                                disabled={this.context.address == null}>
                            <FontAwesomeIcon icon={faSeedling} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Plant Radish
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}