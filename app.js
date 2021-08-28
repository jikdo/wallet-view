
let ethers = window.ethers;
// let nodeURL = 'https://mainnet.infura.io/v3/2832908c4bbb40568db390b15ccae397';

// let customHttpProvider =  new ethers.providers.JsonRpcProvider(nodeURL);
// customHttpProvider.getBlockNumber().then((result) => console.log('Block number is ' + result))

let provider = null;

const ethEnabled = async () => {
    if (window.ethereum) {
        await window.ethereum.send('eth_requestAccounts');
        provider = new ethers.providers.Web3Provider(window.ethereum);

        return true;
    }

    return false;
}

ethEnabled().then(isEnabled => {
    if (isEnabled) {
        // use metmask

        const signer = provider.getSigner();



        provider.getBlockNumber().then(result => console.log(`We are on Block number ${result}!`));

        async function getBlockchainInformation() {
            return {
                currentBlock: await provider.getBlockNumber(),
                balance: ethers.utils.formatEther(await provider.getBalance('ethers.eth')),

            }
        }



        async function getErc20Info(address, abi) {

            // contract object
            const erc20Contract = new ethers.Contract(address, abi, provider);

            return {
                name: await erc20Contract.name(),
                symbol: await erc20Contract.symbol(),
                balance: ethers.utils.formatUnits(await erc20Contract.balanceOf("0x503828976d22510aad0201ac7ec88293211d23da"), 18),
            }

        }

        async function getAddressActivity(erc20ContractInstance) {
            const address = await signer.getAddress();
            // const address = '0x28c6c06298d514db089934071355e5743bf21d60';
            const filterFrom = erc20ContractInstance.filters.Transfer(address, null);
            const filterTo = erc20ContractInstance.filters.Transfer(null, address);


            return {
                balance: ethers.utils.formatEther(await signer.getBalance()),
                transferFrom: filterFrom,
                transferTo: filterTo,
                fromBlockToBlock: await erc20ContractInstance.queryFilter(filterFrom, -4000),
            }
        }




        const daiAddress = 'dai.tokens.ethers.eth';
        const daiABI = [
            // Some details about the token
            "function name() view returns (string)",
            "function symbol() view returns (string)",

            // Get the account balance
            "function balanceOf(address) view returns (uint)",

            // Send some of your tokens to someone else
            "function transfer(address to, uint amount)",

            // An event triggered whenever anyone transfers to someone else
            "event Transfer(address indexed from, address indexed to, uint amount)"
        ];

        const erc20Contract = new ethers.Contract(daiAddress, daiABI, provider);

        getBlockchainInformation().then(result => console.log(result));
        getErc20Info(daiAddress, daiABI).then(result => console.log(result));
        getAddressActivity(erc20Contract).then(result => console.log(result));





        // erc20Contract.on('Transfer', (from, to, amount, event) => {
        //     console.log(`${from} sent ${formatEther(amount)} to ${to}`);
        // })

        // signer.signMessage("Hello world").then(result => result)


        console.log('ended')
    }
    else {
        console.log('no metamask');
    }

});

