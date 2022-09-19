import {createContext, Component} from "react";
import {ethers} from 'ethers'
import initiateFirestore from "./FireStore"
import {addDoc, collection, getDocs} from "firebase/firestore"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import Radish from "../utils/Radish";

const BlockContext = createContext(null)

class BlockProvider extends Component {
    constructor(props) {
        super(props)

        this.db = initiateFirestore()

        this.state = {
            address: null,
            radishes: [],
            ownRadish: null
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
                    (snapshot) => {},
                    (error) => {},
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

    saveRadish = async (data) => {
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

        await addDoc(collection(this.db, 'fundingProjects'), {
            ...copiedData
        })
    }

    plantRadish = async(data) => {
        await this.saveRadish(data)
    }

    async componentDidMount() {
        const address = await this.activeMetaMaskWallet()
        if (address !== null) {
            this.setState({address: address})
        }

        this.ethereum.on('accountsChanged', async (wallets) => {
            this.setState({address: wallets[0] || null})
        })

        const radishes = []
        const response = await getDocs(collection(this.db, 'fundingProjects'))
        response.forEach((rawRadish) => {
            const radishData = rawRadish.data()
            radishes.push(new Radish(radishData))
        })

        this.setState({radishes: radishes})
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
                radishes: this.state.radishes,
                ownRadish: this.state.ownRadish,
                plantRadish: this.plantRadish
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