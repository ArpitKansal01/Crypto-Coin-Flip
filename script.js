
		
        window.addEventListener('DOMContentLoaded', (event) => {
            const connectButton = document.getElementById('connectButton');
            const disconnectButton = document.getElementById('disconnectButton');
            const walletAddressDisplay = document.getElementById('walletAddress');
            const warningMessage = document.getElementById('warningMessage');

            // Check if the browser has Ethereum support (MetaMask)
            if (typeof window.ethereum !== 'undefined') {
                console.log('MetaMask is installed!');

                // Function to connect to the wallet
async function connectWallet() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        walletAddressDisplay.textContent = `Connected account: ${account}`;

        // Clear any warning message
        warningMessage.textContent = '';

        // Store the connected account in localStorage
        localStorage.setItem('walletAddress', account);

		// balance fetching
	   	const balance = await ethereum.request({ method: 'eth_getBalance', params: [account, 'latest']  });
	   	console.log(`Account balance: ${balance}`);
        localStorage.setItem('walletBalance', balance);

        const confirmRedirect = confirm('Wallet connected successfully. Do you want to proceed to the home page?');
        if (confirmRedirect) {
            window.location.href = 'flip.html';
        }
    } catch (error) {
        console.error(`Failed to connect: ${error.message}`);
        warningMessage.textContent = `Failed to connect: ${error.message}`;
    }
}

// Function to disconnect the wallet
function disconnectWallet() {
    if (walletAddressDisplay.textContent === '') {
        console.warn('Wallet not connected');
        warningMessage.textContent = 'Wallet is not connected!';
    } else {
        console.log('Wallet disconnected');
        walletAddressDisplay.textContent = '';

        // Clear the stored wallet information
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletBalance');

        warningMessage.textContent = 'Disconnected successfully!';
    }
}


                // Event listener for the connect button
                connectButton.addEventListener('click', connectWallet);

                // Event listener for the disconnect button
                disconnectButton.addEventListener('click', disconnectWallet);
            } else {
                console.error('MetaMask is not installed!');
                walletAddressDisplay.textContent = '';
                warningMessage.textContent = 'MetaMask is not installed! Please install MetaMask to connect your wallet.';

                // Guide to install MetaMask
                const installGuide = document.createElement('p');
                installGuide.innerHTML = `To install MetaMask, follow these steps:<br>
                1. Go to the <a href="https://metamask.io/download.html" target="_blank">MetaMask website</a>.<br>
                2. Click "Download" and follow the instructions for your browser.<br>
                3. After installation, refresh this page and try connecting your wallet again.`;
                document.querySelector('.position').appendChild(installGuide);

                // Disable the connect button if MetaMask is not installed
                connectButton.disabled = true;
            }
        });

const coin = document.querySelector('#coin');
const button = document.querySelector('#flip');
const status = document.querySelector('#status');
const resultParagraph = document.getElementById('result');
const inputField = document.getElementById('myInput');
const selectBox = document.getElementById('mySelect');
const walletAddressDisplay = document.getElementById('walletAddress');
const walletBalanceDisplay = document.getElementById('walletBalance');
const toggleBalanceButton = document.getElementById('toggleBalance');
const disconnectButton = document.getElementById('disconnectButton');
const modal = document.getElementById('myModal');
const modalMessage = document.getElementById('modalMessage');
const span = document.getElementsByClassName('close')[0];

let walletBalance = parseFloat(localStorage.getItem('walletBalance') || '0');

function deferFn(callback, ms){
    setTimeout(callback, ms);
}

function processResult(result) {
    status.innerText = result.toUpperCase();
}

function flipCoin(){
    if (inputField.value && selectBox.value) {
        const inputValue = parseFloat(inputField.value);
        
        if (walletBalance < inputValue) {
            alert("Insufficient balance!");
            return;
        }

        // Deduct the amount from the wallet
        walletBalance -= inputValue;
        localStorage.setItem('walletBalance', walletBalance);
        walletBalanceDisplay.textContent = `Wallet Balance: ${walletBalance.toFixed(2)}`;

        coin.setAttribute('class', '');
        const random = Math.random();
        const result = random < 0.5 ? 'heads' : 'tails';
        deferFn(function(){
            coin.setAttribute('class', 'animate-' + result);
            deferFn(processResult.bind(null, result), 2900);
        }, 100);
        
        const selectBoxValue = selectBox.value.toLowerCase();
        deferFn(function(){
            if (selectBoxValue === result) {
                multiply(inputValue); // Pass inputValue to multiply function
                showModal(`Congratulations! You won ${inputValue * 2}!`);
            } else {
              //  resultParagraph.textContent = 'You lost!';
                showModal('Sorry, you lost!');
            }
        }, 2900);
    } else {
        alert("Please enter a value and select heads or tails.");
    }
}

function multiply(inputValue) {
    const multipliedValue = inputValue * 2;
    walletBalance += multipliedValue;
    localStorage.setItem('walletBalance', walletBalance);
    walletBalanceDisplay.textContent = `Wallet  Balance: ${walletBalance.toFixed(2)}`;
   // resultParagraph.textContent = `You Won: ${multipliedValue.toFixed(2)}`;
}

button.addEventListener('click', flipCoin);

function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = "block";
}

// Close the modal when the user clicks on <span> (x)
span.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Initialize Wallet Info
const walletAddress = localStorage.getItem('walletAddress');
if (walletAddress) {
    walletAddressDisplay.textContent = `Connected account: ${walletAddress}`;
    walletBalanceDisplay.textContent = `Wallet Balance: ****`; // Start with balance hidden
} else {
    walletAddressDisplay.textContent = 'No wallet connected';
    walletBalanceDisplay.style.display = 'none';
    toggleBalanceButton.style.display = 'none';
    disconnectButton.style.display = 'none';
}

let isBalanceVisible = false; // Start with balance hidden
toggleBalanceButton.addEventListener('click', () => {
    isBalanceVisible = !isBalanceVisible;
    walletBalanceDisplay.textContent = isBalanceVisible ? `Wallet Balance: ${walletBalance.toFixed(2)}` : 'Wallet Balance: ****';
    toggleBalanceButton.src = isBalanceVisible 
        ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRM6kPM9EpUS46N4VpeobVAFa6cjFj5VjMfw&s' // Eye icon when balance is visible
        : 'https://www.kindpng.com/picc/m/377-3772548_hide-eye-on-off-icon-hd-png-download.png'; // Eye icon when balance is hidden
});

disconnectButton.addEventListener('click', () => {
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletBalance');
    alert('Wallet disconnected successfully!');
    window.location.href = 'index.html';
});
