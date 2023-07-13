const requestWalletConnection = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
        try {
            if (window.ethereum.request) {
                return window.ethereum.request({ method: 'eth_requestAccounts' });
            } else {
                console.log('Metamask request method is undefined');
            }
        } catch (error) {
            console.log('User denied account access');
        }
    } else {
        console.log('Metamask not detected');
    }
};

export default requestWalletConnection;