import {Component} from "react"

export default class Creator extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Launch new Project!</h2>


                    <div className="form-control">
                        <label className="input-group">
                            <span>Token Address</span>
                            <input type="text" placeholder="0x0000000000000000000000000000000000000000"
                                   className="input input-bordered"/>
                        </label>
                    </div>

                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Plant Radish</button>
                    </div>
                </div>
            </div>
        )
    }
}