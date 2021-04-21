async connectWeb3() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                console.log('Please connect to MetaMask, or Connect an account');
            } else {
                this.setState({
                    accounts
                })
                const account = await window.ethereum.selectedAddress
                this.setState({ account })
                const balance = await web3.eth.getBalance(account)
                console.log(balance)
            }
            const web3 = new Web3(window.ethereum)
            this.setState({
                web3
            })
            // 97 test net 56 main net
            const chainId = await ethereum.request({
                method: 'eth_chainId'
            })
            if (chainId != 97) {
                console.log("Plese connect to the Binance Test Net ChainID 97 to enable this App");
            }
            window.ethereum.on('accountsChanged', function (accounts) {
                // Time to reload your interface with accounts[0]!
                if (accounts.length === 0) {
                    // MetaMask is locked or the user has not connected any accounts
                    console.log('Please connect to MetaMask.');
                } else if (accounts[0] !== currentAccount) {
                    currentAccount = accounts[0];
                    window.location.reload()
                }
            })
            window.ethereum.on('networkChanged', function (networkId) {
                // We recommend reloading the page, unless you must do otherwise
                window.location.reload()
            })
            await this.getData()
        } catch (error) {
            if (error.code === 4001) {
                // User rejected request
            }

            console.log(error)
        }
    } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetMask!')
    }
}

async getData() {
        if (this.state.web3) {
            try {
                const nfmContract = new this.state.web3.eth.Contract(nfmContractABI, nfmContractAddress)
                const psawpContract = new this.state.web3.eth.Contract(pswapLiquidityABI, psawpContractAddress)
                const totalSupply = await nfmContract.methods.totalSupply().call
                if (this.state.cards.length === 0 || this.state.totalSupply < totalSupply) {
                    const cards = []
                    for (let i = 0; i < totalSupply; i++) {
                        const card = {}
                        const data = await nfmContract.methods.meme(i).call()
                        const cardNumber = data[1].toString()
                        card.cardNumber = cardNumber
                        const ownerOfCard = await nfmContract.methods.ownerOf(i).call()
                        card.ownerOfCard = ownerOfCard
                        card.name = CardData[cardNumber - 1].cardName
                        card.text = CardData[cardNumber - 1].cardText
                        card.rarity = CardData[cardNumber - 1].cardRarity
                        card.fileName = CardData[cardNumber - 1].fileName
                        card.badges = []

                        cards.push(card)

                        this.setState({
                            cards
                        })
                    }
                    this.setState({loaded: true})
                }

            } catch (error) {
                console.log(error)
            }
        }
}