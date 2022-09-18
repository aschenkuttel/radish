import {createContext, Component} from "react";
import {ethers} from 'ethers'
import initiateFirestore from "./FireStore"

const BlockContext = createContext(null)

class BlockProvider extends Component {
    constructor(props) {
        super(props)

        this.db = initiateFirestore()

        this.state = {
            address: null,
            projects: [],
            personalProjects: []
        }

        const {ethereum} = window
        this.ethereum = ethereum

        if (this.ethereum) {
            this.provider = new ethers.providers.Web3Provider(ethereum)
        } else {
            this.provider = new ethers.providers.JsonRpcProvider("https://eth.bd.evmos.dev:8545/")
        }
    }

    async activeMetaMaskWallet() {
        const accounts = await this.provider.listAccounts()
        return (accounts.length > 0) ? accounts[0] : null
    }

    async componentDidMount() {
        const address = await this.activeMetaMaskWallet()
        if (address !== null) {
            this.setState({address: address})
        }

        this.ethereum.on('accountsChanged', async (wallets) => {
            this.setState({address: wallets[0] || null})
        })
    }

    connect = async () => {
        if (this.state.address === null) {
            await this.provider.send("eth_requestAccounts", [])
            const signer = this.provider.getSigner()
            const address = await signer.getAddress()

            this.setState({
                address: address
            })
        }
    }

    render() {
        return (
            <BlockContext.Provider  value={{
                address: this.state.address,
                connect: this.connect,
            }}>
                {this.props.children}
            </BlockContext.Provider>
        )
    }
}

export {
    BlockContext,
    BlockProvider
}