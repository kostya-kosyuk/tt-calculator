import Web3 from 'web3';

const contractAddress = '0x1851ffBce02A134eFd9ddBC91920b0c6DCEfB6f5';
const contractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "string", "name": "operation", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "a", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "b", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "result", "type": "uint256" }], "name": "Result", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "a", "type": "uint256" }, { "internalType": "uint256", "name": "b", "type": "uint256" }], "name": "add", "outputs": [{ "internalType": "uint256", "name": "result", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "a", "type": "uint256" }, { "internalType": "uint256", "name": "b", "type": "uint256" }], "name": "divide", "outputs": [{ "internalType": "uint256", "name": "result", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "a", "type": "uint256" }, { "internalType": "uint256", "name": "b", "type": "uint256" }], "name": "multiply", "outputs": [{ "internalType": "uint256", "name": "result", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "a", "type": "uint256" }, { "internalType": "uint256", "name": "b", "type": "uint256" }], "name": "subtract", "outputs": [{ "internalType": "uint256", "name": "result", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "usageCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];

let web3: Web3;
let contract: any;
let account: any;

export const web3Initialize = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum as string);
        contract = new web3.eth.Contract(contractABI, contractAddress);
        account = await getAccount();
    }
};

const clientTransaction = async  (a: number, b: number, transactionMethod: string) => {
    try {
        const method = contract.methods[transactionMethod](a, b);
        const result = await method.call({ from: account });
        const response = await method.send({ from: account });

        return Number(result);
    } catch (error) {
            console.log(error);
        return null;
    }
};

export const sendTransaction = (a: number, b: number, operation: string) => {
    let transactionMethod;

    switch  (operation) {
        case '+': transactionMethod = 'add'; break;
        case '-': transactionMethod = 'subtract'; break;
        case ':': transactionMethod = 'divide'; break;
        case '*': transactionMethod = 'multiply'; break;
        default: throw new Error("Unknown operation: " + operation);
        ;
    }

    return clientTransaction(a, b, transactionMethod);
};

export const getUsageCount = async () => {
    try {
        const usageCount = await contract.methods.usageCount().call();
        return usageCount;
    } catch (error) {
        console.error('Error while getting "usageCount":', error);
        return null;
    }
};

export const getAccount = async (): Promise<string | null> => {
    try {
        const accounts = await web3.eth.requestAccounts();
        return accounts[0];
    } catch (error) {
        console.error('Error while getting wallet adress:', error);
        return null;
    }
};
