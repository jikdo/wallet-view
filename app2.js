let ethers = window.ethers;
let provider = null;
if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
}

let signer = null;

const erc20ABI = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    // "function decimals() view returns (unit8)",

    // Get the account balance
    "function balanceOf(address) view returns (uint)",

    // Send some of your tokens to someone else
    "function transfer(address to, uint amount)",

    // An event triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

const erc20TokenList = [
    '0xbddab785b306bcd9fb056da189615cc8ece1d823',
    '0xc12d1c73ee7dc3615ba4e37e4abfdbddfa38907e',
    '0x85332b222787eacab0fff68cf3b884798823528c',
]

async function connectMetamask() {

    if (provider) {
        await window.ethereum.send('eth_requestAccounts');

        signer = provider.getSigner();

        // make form content connected address
        document.forms['searchForm']['walletAddress'].value = await signer.getAddress();

        let ethBalance = ethers.utils.formatEther(await signer.getBalance());
        document.getElementById('ethBalance').innerHTML = ethBalance;

        return true;
    }

    return false;
}

async function getErc20Balance(erc20Address, abi, walletAddress) {
    // instantiate contract
    const erc20Contract = new ethers.Contract(erc20Address, abi, provider);

    return {
        name: await erc20Contract.name(),
        symbol: await erc20Contract.symbol(),
        balance: ethers.utils.formatUnits(await erc20Contract.balanceOf(walletAddress), 18)
    }
}

async function getAllErc20Balance(erc20TokenList) {
    let erc20TokenBalances = [];
    for (i = 0; i < erc20TokenList.length; i++) {
        erc20TokenBalances.push(await getErc20Balance(erc20TokenList[i], erc20ABI, document.forms['searchForm']['walletAddress'].value));
    }
    return erc20TokenBalances;
}

async function getAddressBalance() {
    if (provider) {
        const address = document.forms['searchForm']['walletAddress'].value;
        const ethBalance = ethers.utils.formatEther(await provider.getBalance(address));

        document.getElementById('ethBalance').innerHTML = ethBalance;

        const erc20Balances = await getAllErc20Balance(erc20TokenList);


        // apend to list
        let ulTokenList = document.getElementById('tokenList');
        let tokenListItems = document.getElementsByClassName('list-group-item');

        for (i = 0; i < erc20Balances.length; i++) {
            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.classList.add('d-flex');
            li.classList.add('justify-content-between');

            li.innerHTML = `<ul class="list-unstyled"><li>${erc20Balances[i].name}</li><li>${erc20Balances[i].balance} ${erc20Balances[i].symbol}</li></ul>`;
            ulTokenList.appendChild(li);
        }
        console.log(tokenListItems)




    }


}