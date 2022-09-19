import {Component} from "react"
import {parseEther} from "ethers/lib/utils"

export default class Creator extends Component {
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
            token: "",
            softCap: 0,
            hardCap: 0,
            minimumContribution: 0,
            maximumContribution: 0,
            startTime: null,
            endTime: null,
            presaleRate: 0,
            listingRate: 0,
            liquidityRate: 0,
            lockedTill: null,
        }
    }

    render() {
        return (
            <div className="card max-w-3xl bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-2">Plant new Radish!</h2>

                    <div className="form-control flex flex-col gap-2">
                        <label className="w-full input-group">
                            <span className="w-32 whitespace-nowrap bg-primary text-white text-sm">
                                Token Address
                            </span>
                            <input type="text" placeholder="0x0000000000000000000000000000000000000000"
                                   className="input input-bordered flex-1"
                                   onChange={(e) => this.data.address = e.target.value}/>
                        </label>

                        <div className="flex gap-2">
                            <label className="input-group input-sm px-0">
                                <span className="w-48 whitespace-nowrap bg-primary text-white text-xs">
                                    Min. Contribution
                                </span>
                                <input type="number" placeholder="0" className="input input-bordered input-sm w-inherit"
                                       onChange={(e) => this.data.minimumContribution = parseEther(e.target.value)}/>
                            </label>
                            <label className="input-group input-sm px-0">
                                <span className="w-48 whitespace-nowrap bg-primary text-white text-xs">
                                    Max. Contribution
                                </span>
                                <input type="number" placeholder="0" className="input input-bordered input-sm w-inherit"
                                       onChange={(e) => this.data.maximumContribution = parseEther(e.target.value)}/>
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <label className="input-group input-sm px-0">
                                <span className="w-48 whitespace-nowrap bg-primary text-white text-sm">
                                    Soft Cap
                                </span>
                                <input type="number" placeholder="0"
                                       className="input input-bordered input-sm w-inherit"
                                       onChange={(e) => this.data.softCap = parseEther(e.target.value)}/>
                            </label>
                            <label className="input-group input-sm px-0">
                                <span className="w-48 whitespace-nowrap bg-primary text-white text-sm">
                                    Hard Cap
                                </span>
                                <input type="number" placeholder="0"
                                       className="input input-bordered input-sm w-inherit"
                                       onChange={(e) => this.data.hardCap = parseEther(e.target.value)}/>
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <label className="input-group input-sm px-0">
                                <span className="w-48 whitespace-nowrap bg-primary text-white text-sm">
                                    Start Date
                                </span>
                                <input type="text" placeholder={this.placeholderDate}
                                       className="input input-bordered input-sm w-inherit"
                                       onChange={(e) => this.data.startTime = new Date(e.target.value)}/>
                            </label>
                            <label className="input-group input-sm px-0">
                                <span className="w-48 whitespace-nowrap bg-primary text-white text-sm">
                                    End Date
                                </span>
                                <input type="text" placeholder={this.placeholderDate}
                                       className="input input-bordered input-sm w-inherit"
                                       onChange={(e) => this.data.endTime = new Date(e.target.value)}/>
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <label className="input-group input-sm px-0">
                                <span className="w-48 whitespace-nowrap bg-primary text-white text-sm">
                                    Presale Rate
                                </span>
                                <input type="number" placeholder="0"
                                       className="input input-bordered input-sm w-inherit"
                                       onChange={(e) => this.data.presaleRate = parseEther(e.target.value)}/>
                            </label>
                            <label className="input-group input-sm px-0">
                                <span className="w-48 whitespace-nowrap bg-primary text-white text-sm">
                                    Listing Rate
                                </span>
                                <input type="number" placeholder="0"
                                       className="input input-bordered input-sm w-inherit"
                                       onChange={(e) => this.data.listingRate = parseEther(e.target.value)}/>
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <label className="input-group input-sm px-0">
                                <span className="w-48 whitespace-nowrap bg-primary text-white text-sm">
                                    Liquidity Rate
                                </span>
                                <input type="number" placeholder="0"
                                       className="input input-bordered input-sm w-inherit"
                                       onChange={(e) => this.data.liquidityRate = parseEther(e.target.value)}/>
                            </label>
                            <label className="input-group input-sm px-0">
                                <span className="w-48 whitespace-nowrap bg-primary text-white text-sm">
                                    Locked Till
                                </span>
                                <input type="text" placeholder={this.placeholderDate}
                                       className="input input-bordered input-sm w-inherit"
                                       onChange={(e) => this.data.lockedTill = new Date(e.target.value)}/>
                            </label>
                        </div>
                    </div>

                    <div className="card-actions justify-end">
                        <button className="btn btn-accent bg-rose-600 border-rose-600 text-white opacity-75"
                                onClick={() => console.log(this.data)}>Plant Radish
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}