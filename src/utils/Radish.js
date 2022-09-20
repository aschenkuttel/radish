import {formatEther} from "ethers/lib/utils"
import {BigNumber} from "ethers"
import strftime from "strftime"
import {ethers} from "ethers"
import {ERC20ABI} from "../data/ABI"

export default class Radish {
    constructor(provider, data) {
        this.planter = data.planter
        this.photoUrl = data.photoUrl
        this.description = data.description
        this.tokenAddress = data.tokenAddress
        this.token = new ethers.Contract(this.tokenAddress, ERC20ABI, provider)
        this.tokenName = ""
        this.fundingSymbol = "EVMOS"
        this.fulfilledAmount = BigNumber.from(data.fulfilledAmount)
        this.softCap = BigNumber.from(data.softCap)
        this.hardCap = BigNumber.from(data.hardCap)
        this.minimumContribution = BigNumber.from(data.minimumContribution)
        this.maximumContribution = BigNumber.from(data.maximumContribution)
        this.startTime = new Date(data.startTime.seconds * 1000)
        this.endTime = new Date(data.endTime.seconds * 1000)
        this.presaleRate = data.presaleRate
        this.listingRate = data.listingRate
        this.liquidityRate = data.liquidityRate
        this.lockedTill = new Date(data.lockedTill.seconds * 1000)
        this.successfull = new Date() > this.endTime
        this.active = data.active
        this.gardeners = data.gardeners
        this.currentVote = null
    }

    get displayName() {
        return this.tokenName || "Unknown Name"
    }

    fetchMetaData = async (provider) => {
        if (this.tokenName) return
        const signer = this.token.connect(provider.getSigner())
        this.tokenName = await signer.name()
    }

    readable = (key) => {
        const value = this[key]

        if (value instanceof Date) {
            return strftime("%d.%m.%y at %H:%M", value)
        } else {
            const str = formatEther(this[key])
            if (str.endsWith(".0")) {
                return parseInt(str)
            } else {
                return str
            }
        }
    }
}