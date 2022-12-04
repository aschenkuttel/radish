import {BigNumber} from "ethers"
import {parseEther} from "ethers/lib/utils"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faDroplet} from "@fortawesome/pro-solid-svg-icons"
import BaseExplorer from "./BaseExplorer"
import {Fragment} from "react"
import {Button, Input, InputGroup, Modal} from "react-daisyui"

export default class Explorer extends BaseExplorer {
    liquidityHighlight = (radish) => {
        if (radish.liquidityRate < 50) {
            return <span className="text-sm text-red-800">
                <span className="font-bold">WARNING! </span>
                LIQUIDITY RATE:
                <span className="text-neutral-focus"> {radish.liquidityRate}%</span>
            </span>
        } else if (radish.liquidityRate < 80) {
            return <Fragment>
                <span className="text-sm font-bold text-orange-800">LIQUIDITY RATE: </span>
                <span>{radish.liquidityRate}%</span>
            </Fragment>
        } else {
            return <Fragment>
                <span className="text-sm font-bold text-primary">LIQUIDITY RATE: </span>
                <span>{radish.liquidityRate}%</span>
            </Fragment>
        }
    }

    waterRadish = async () => {
        if (this.data.waterAmount) {
            await this.context.waterRadish(this.state.openModal, this.data.waterAmount)
        }

        this.toggleModal(null)
    }

    modal = () => {
        return (
            <Modal open={this.state.openModal}>
                <Modal.Body>
                    <div className="flex gap-6">
                        <InputGroup>
                            <Input type="number" placeholder="0" bordered className="w-inherit"
                                   onChange={(e) => this.data.waterAmount = parseEther(e.target.value)}/>
                            <span>EVMOS</span>
                        </InputGroup>
                        <Button className="text-white bg-sky-700 hover:bg-sky-800 border-sky-700 hover:border-sky-800"
                                onClick={this.waterRadish}>
                            <FontAwesomeIcon icon={faDroplet} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Water Radish
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    generateCard = (radish, index) => {
        const rawPercentageReached = (radish.fulfilledAmount.mul(BigNumber.from(1000)).div(radish.hardCap))
        const percentageReached = Math.round(parseInt(rawPercentageReached) * 10) / 100
        const disabled = radish.startTime > new Date() || new Date() > radish.endTime

        return (
            <div key={index} className="card w-card shadow-xl">
                <figure className="bg-base-200"><img src={radish.photoUrl} className="project-icon" alt="Project Icon"/>
                </figure>
                <div className="card-body">
                    <p className="text-2xl text-center font-bold font-mono">{radish.displayName}</p>
                    <p className="text-sm text-center">{radish.description || "Missing Description"}</p>

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

                    <div className="text-center">
                        <p>{this.liquidityHighlight(radish)}</p>
                    </div>

                    <div className="divider"></div>

                    <div className="flex justify-between items-center gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="font-bold mt-1 text-primary">LOCKED TILL:</span>
                            <span
                                className="font-medium text-black">{radish.readable('lockedTill')}</span>
                        </div>
                        <button
                            className="btn btn-primary text-white bg-sky-700 hover:bg-sky-800 border-sky-700 hover:border-sky-800"
                            disabled={disabled} onClick={() => {
                            this.toggleModal(radish)
                        }}>
                            <FontAwesomeIcon icon={faDroplet} className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Water Radish
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}