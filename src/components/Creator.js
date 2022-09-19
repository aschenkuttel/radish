import {Component} from "react"
import {parseEther} from "ethers/lib/utils"
import {BlockContext} from "./BlockHandler"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSeedling} from "@fortawesome/pro-solid-svg-icons";

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
        const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()]
        const [hour, minutes] = [date.getHours(), date.getMinutes()]
        this.placeholderDate = `${aC(year)}-${aC(month)}-${aC(day)} ${aC(hour)}:${aC(minutes)}`

        this.data = {
            tokenAddress: "",
            softCap: 0,
            hardCap: 0,
            fulfilledFunds: 0,
            minimumContribution: 0,
            maximumContribution: 0,
            startTime: null,
            endTime: null,
            presaleRate: 0,
            listingRate: 0,
            liquidityRate: 0,
            lockedTill: null,
            file: null,
            description: ""
        }
    }

    render() {
        return (
            <div className="card max-w-3xl bg-base-100 shadow-xl overflow-visible">
                <div className="card-body">
                    <h2 className="card-title justify-center mb-2">Plant new Radish!</h2>

                    <div className="divider"></div>

                    <div className="form-control flex flex-col gap-2">
                        <div className="flex-1">
                            <div className="tooltip tooltip-top"
                                 data-tip="The amount of token the user receives per Evmos in Presale">
                                <p className="font-medium ml-1">Token Address</p>
                            </div>
                            <input type="text" placeholder="0x0000000000000000000000000000000000000000"
                                   className="input input-bordered w-full"
                                   onChange={(e) => this.data.tokenAddress = e.target.value}/>
                        </div>

                        <div className="tooltip tooltip-top w-full" data-tip="Project Image (2:1 Resolution)">
                            <input
                                className="block w-full text-sm text-gray-900 bg-base-100 rounded-lg border border-gray-100 cursor-pointer input-bordered"
                                id="file_input" type="file" onChange={(e) => this.data.file = e.target.files[0]}
                                style={{borderColor: "hsl(var(--bc) / 0.2)"}}/>
                        </div>

                        <textarea className="textarea" placeholder="Description"></textarea>

                        <div className="divider"></div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <div className="tooltip tooltip-top" data-tip="Minimum amount a user can fund">
                                    <p className="font-medium ml-1">Minimum Contribution</p>
                                </div>
                                <input type="number" placeholder="Type here" className="input input-bordered w-full"
                                       onChange={(e) => this.data.minimumContribution = parseEther(e.target.value)}/>
                            </div>
                            <div className="flex-1">
                                <div className="tooltip tooltip-top" data-tip="Maximum amount a user can fund">
                                    <p className="font-medium ml-1">Maximum Contribution</p>
                                </div>
                                <input type="number" placeholder="Type here" className="input input-bordered w-full"
                                       onChange={(e) => this.data.maximumContribution = parseEther(e.target.value)}/>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <div className="tooltip tooltip-top"
                                     data-tip="Minimal funding amount which needs to be reached">
                                    <p className="font-medium ml-1">Soft Cap</p>
                                </div>
                                <input type="number" placeholder="Type here" className="input input-bordered w-full"
                                       onChange={(e) => this.data.softCap = parseEther(e.target.value)}/>
                            </div>
                            <div className="flex-1">
                                <div className="tooltip tooltip-top" data-tip="Maximal funding amount in total">
                                    <p className="font-medium ml-1">Hard Cap</p>
                                </div>
                                <input type="number" placeholder="Type here" className="input input-bordered w-full"
                                       onChange={(e) => this.data.hardCap = parseEther(e.target.value)}/>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <div className="tooltip tooltip-top" data-tip="Start Date of Presale">
                                    <p className="font-medium ml-1">Start Date</p>
                                </div>
                                <input type="text" placeholder={this.placeholderDate}
                                       className="input input-bordered w-full"
                                       onChange={(e) => this.data.startTime = new Date(e.target.value)}/>
                            </div>
                            <div className="flex-1">
                                <div className="tooltip tooltip-top" data-tip="End Date of Presale">
                                    <p className="font-medium ml-1">End Date</p>
                                </div>
                                <input type="text" placeholder={this.placeholderDate}
                                       className="input input-bordered w-full"
                                       onChange={(e) => this.data.endTime = new Date(e.target.value)}/>
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
                                       onChange={(e) => this.data.presaleRate = parseInt(e.target.value)}/>
                            </div>
                            <div className="flex-1">
                                <div className="tooltip tooltip-top"
                                     data-tip="The amount of token the user receives per Evmos in Exchange">
                                    <p className="font-medium ml-1">Listing Rate</p>
                                </div>
                                <input type="number" placeholder="0" className="input input-bordered w-full"
                                       onChange={(e) => this.data.listingRate = parseInt(e.target.value)}/>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <div className="tooltip tooltip-top"
                                     data-tip="The percentage of funded Evmos which will be used as liquidity">
                                    <p className="font-medium ml-1">Liquidity Rate</p>
                                </div>
                                <input type="number" placeholder="0" className="input input-bordered w-full"
                                       onChange={(e) => this.data.liquidityRate = parseInt(e.target.value)}/>
                            </div>
                            <div className="flex-1">
                                <div className="tooltip tooltip-top"
                                     data-tip="Date till when liquidity will be definitely locked">
                                    <p className="font-medium ml-1">Locked Till</p>
                                </div>
                                <input type="text" placeholder={this.placeholderDate} className="input input-bordered w-full"
                                       onChange={(e) => this.data.lockedTill = new Date(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="card-actions justify-end">
                        <button className="btn btn-accent bg-rose-600 border-rose-600 text-white opacity-75"
                                onClick={async () => await this.context.plantRadish(this.data)}>
                            <FontAwesomeIcon icon={faSeedling} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Plant Radish
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}