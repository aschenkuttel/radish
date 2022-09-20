import {createContext, Component} from "react"
import {ethers} from 'ethers'
import {parseEther} from "ethers/lib/utils"
import initiateFirestore from "./FireStore"
import {doc, setDoc, updateDoc, collection, getDocs} from "firebase/firestore"
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import {gardenABI} from "../data/ABI"
import Radish from "../utils/Radish"

const BlockContext = createContext(null)

class BlockProvider extends Component {
    constructor(props) {
        super(props)

        this.db = initiateFirestore()

        this.state = {
            address: null,
            radishes: [],
            ownRadish: null,
            wateredRadishes: []
        }

        const {ethereum} = window
        this.ethereum = ethereum

        if (this.ethereum) {
            this.provider = new ethers.providers.Web3Provider(ethereum)
        } else {
            this.provider = new ethers.providers.JsonRpcProvider("https://eth.bd.evmos.dev:8545/")
        }

        this.gardenAddress = "0x788Dd38429BadaB14b3ad4d33F6c4a2552635Fc3"
        this.garden = new ethers.Contract(this.gardenAddress, gardenABI, this.provider)
    }

    async activeMetaMaskWallet() {
        const accounts = await this.provider.listAccounts()
        return (accounts.length > 0) ? accounts[0] : null
    }

    uploadRadishIcon = async (file) => {
        const storage = getStorage();
        const metadata = {
            contentType: 'image/jpeg'
        };

        const storageRef = ref(storage, 'images/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        return new Promise(
            (resolve) => {
                uploadTask.on('state_changed',
                    (_) => {
                    },
                    (error) => {
                        console.log(error)
                    },
                    () => {
                        // Upload completed successfully, now we can get the download URL
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            resolve(downloadURL);
                        });
                    }
                );
            }
        )
    }

    saveRadish = async (data, address) => {
        const copiedData = {...data}
        delete copiedData.file

        if (data.file !== null) {
            copiedData.photoUrl = await this.uploadRadishIcon(data.file)
        } else {
            copiedData.photoUrl = "https://firebasestorage.googleapis.com/v0/b/radish-bdd18.appspot.com/o/placeholder-image.png?alt=media&token=17e5ba0d-5bea-48d5-975d-2f1a632246a9"
        }

        for (const key of Object.keys(copiedData)) {
            if (copiedData[key]._isBigNumber) {
                copiedData[key] = copiedData[key].toString()
            }
        }

        const docRef = doc(this.db, "growingRadishes", address)
        await setDoc(docRef, {
            ...copiedData
        })
    }

    plantRadish = async (data) => {
        const signer = this.garden.connect(this.provider.getSigner())
        console.log("CONNECTED")

        // TODO SEND EVMOS
        signer.createRadish(
            data.tokenAddress,
            data.softCap,
            data.hardCap,
            Math.round(data.startTime.getTime() / 1000),
            Math.round(data.endTime.getTime() / 1000),
            data.minimumContribution,
            data.maximumContribution
        ).then(async (response) => {
            await response.wait()

            const radishAddress = await signer.getRadish(this.state.address)
            data['planter'] = this.state.address
            data.gardeners = []
            await this.saveRadish(data, radishAddress)
            await this.fetchFromDatabase()

        }).catch((error) => {
            console.log(error)
        })
    }

    waterRadish = async (radish, amount) => {
        try {
            const signer = radish.contract.connect(radish.provider.getSigner())
            const response = await signer.water({value: amount})
            await response.wait()
        } catch (error) {
            console.log(error)
        }
    }

    async fetchFromDatabase() {
        const radishes = []
        let ownRadish = null
        const wateredRadishes = []
        const response = await getDocs(collection(this.db, 'growingRadishes'))

        response.forEach((rawRadish) => {
            const radishData = rawRadish.data()
            radishData.address = rawRadish.id
            const radish = new Radish(this.provider, radishData)

            radishes.push(radish)

            if (this.state.address === radish.planter) {
                ownRadish = radish
            } else if (radish.gardeners.includes(this.state.address) || true)
                wateredRadishes.push(radish)
        })

        this.setState({
            radishes: radishes,
            ownRadish: ownRadish,
            wateredRadishes: wateredRadishes
        })

        for (const radish of radishes) {
            await radish.fetchMetaData(this.provider)
            await radish.fetchStats(this.provider)

            const docRef = doc(this.db, "growingRadishes", radish.address)
            await updateDoc(docRef, {
                fulfilledAmount: radish.fulfilledAmount.toString(),
                tokenName: radish.tokenName
            })
        }
    }

    async componentDidMount() {
        const address = await this.activeMetaMaskWallet()
        if (address !== null) {
            this.setState({address: address})
        }

        if (this.ethereum) {
            this.ethereum.on('accountsChanged', async (wallets) => {
                const currentWallet = (wallets.length > 0) ? wallets[0] : null
                const address = (currentWallet) ? ethers.utils.getAddress(currentWallet) : null
                this.setState({address: address}, this.fetchFromDatabase)
            })
        }

        await this.fetchFromDatabase()
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
            <BlockContext.Provider value={{
                address: this.state.address,
                connect: this.connect,
                radishes: this.state.radishes,
                ownRadish: this.state.ownRadish,
                plantRadish: this.plantRadish,
                waterRadish: this.waterRadish
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