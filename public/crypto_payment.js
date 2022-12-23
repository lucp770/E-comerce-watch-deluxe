//create a loading screen, get the data from the user and the total from the localstorage;
//creating a loading circle
// open metamask, to execute a transaction
//if transaction suceeded, then change the page to green, otherwise change to red.

//_________________// get DOM elements //___________________________//

const totalContainer = document.querySelector('.user-total-container');
const informText = document.querySelector('.information-banner');
const userTotal = document.querySelector('.user-total');
const confirmPayment = document.querySelector('.finish-payment');
const cancelPayment = document.querySelector('.cancel-payment');
let ETHPrice;

//----------------get data from localStorage:----------------//

//user and total
const {user, total} = JSON.parse(localStorage.getItem('userAndTotalValue'));

//------------------------loading total in usdt and checking metamask.-----------------------------

async function executeTransaction(sender, recipient, total, gasPrice,signer_provider){
   let signer = signer_provider;
    transaction_nounce = await signer_provider.getTransactionCount(sender,'latest');

   const tx = {
      from: sender,
      to: recipient,
      value: ethers.utils.parseUnits(total, "ether"),
      gasPrice: ethers.utils.parseUnits(gasPrice, "ether"),
      gasLimit: ethers.utils.hexlify(100000), //100 000 gwei
      nounce: transaction_nounce
   };

   const transaction = await signer.sendTransaction(sender,'latest');
   return transaction;

}

 async function getAdress(){
      //get the eth provider (metamask)
   let provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli');
   console.log('jsonprovider', provider);
   let signer_provider = new ethers.providers.Web3Provider(window.ethereum);
    try{
      //i guess i could get the data to be fin
        let accounts = await signer_provider.send("eth_requestAccounts", []);
    return accounts;

    }catch(e){
        console.log(e);
    }
 }

 async function getEthPrice(price){
   //get ethtoUSD price from the binance API.
   try{

      let ethToUSDT  = await fetch('https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1m');
      // let data ='binance'
      ethToUSDT = await ethToUSDT.json();
      ethToUSDT = ethToUSDT[ethToUSDT.length-1][4];

      let totalEth = await price/ethToUSDT; // (1000 USDT/1 ETH)*(1/ 20 USDT)
      return {totalEth, ethToUSDT};

   }catch(e){
      console.log(e);
   }
    
 }

async function fillDom(){
   //get the eth provider (metamask)
   let provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli');
   let signer_provider = new ethers.providers.Web3Provider(window.ethereum);
   const signer = await signer_provider.getSigner();
   //get the gas price:
   let gasPrice = await signer_provider.getGasPrice();
   //convert gasPrice to ether.
   gasPrice =  ethers.utils.formatUnits(gasPrice,'ether');

//tudo isso numa funcao;
   getEthPrice(total).then( ({totalEth, ethToUSDT}) =>{
   let text = (totalEth+Number(gasPrice)).toFixed(7).toString();
   let totalNoGas = totalEth.toString();

   //total in dolars
   let newTotal = total + gasPrice/ethToUSDT;

   localStorage.setItem("TotalInETHWithGas",JSON.stringify(text));
   localStorage.setItem("TotalInETH",JSON.stringify(totalNoGas));
   //set the inner html

   userTotal.innerHTML = text +' ETH' + ' ( $'+ newTotal.toFixed(2) +' )';
   confirmPayment.classList.remove('disabled-button');

   //ativar os botões

   })
}

document.addEventListener('DOMContentLoaded',fillDom);

userTotal.addEventListener('mouseover',()=>{
   informText.classList.remove('hidden');
})

userTotal.addEventListener('mouseleave',()=>{
   informText.classList.add('hidden');
})

confirmPayment.addEventListener('click', async ()=>{

     //the wallet associated with the 
   const recipient = '0x7A77e531E1e7444027817356f2dCf5349fEd2e84';
   let sender = await getAdress();

   //above function returns an array, get the first item
   sender = sender[0];
   console.log('sender adress: ', sender);
   
   //get the total without gas fees
   let newTotal = JSON.parse(localStorage.getItem('TotalInETH'));

   //get the eth provider (metamask)
   let signer_provider = new ethers.providers.Web3Provider(window.ethereum);
   const signer = await signer_provider.getSigner();

   //get the gas price:
   let gasPrice = await signer_provider.getGasPrice();
   //convert gasPrice to ether.
   gasPrice =  ethers.utils.formatUnits(gasPrice,'ether');

   //check if connected to the goerli network, if connected then execute the transaction, otherwise throw an error.
   const {chainId} = await signer_provider.getNetwork();
   console.log('network', chainId);

   if(chainId ===5){
      console.log('sender: ', sender, 'recipient: ', recipient,'newtotal: ', newTotal, 'gasPrice: ', gasPrice, 'signer_provider: ', signer_provider)
     
      let nounce = await signer_provider.getTransactionCount(sender, 'latest');

      const tx = {
      from: sender,
      to: recipient,
      value: ethers.utils.parseUnits(newTotal, "ether"),
      gasPrice: ethers.utils.parseUnits(gasPrice, "ether"),
      gasLimit: ethers.utils.hexlify(100000), //100 000 gwei
      nounce: nounce,
      chainId: 5
   };
      console.log('transaction:', tx);

      console.log('executing transaction ....');

       let transaction = await executeTransaction(sender, recipient, newTotal, gasPrice, signer_provider);
       console.log(transaction);
      //check if everythinf is in hex
     

   }
   else{
      alert('Please connect to the Goerli Network in your MetaMask');
   }

  
})

cancelPayment.addEventListener('click', ()=>{
   localStorage.removeItem('TotalInETH');
   localStorage.removeItem('paymentMethod');
   
   //back to main page:
   window.location.href = './index.html';
})


//--------------------//--------//------------//------------------

//O pagameto foi totalizado em $ethers, cofirmar pagamento?

// get_data().then((data)=> data.json()).then((result)=>{
//    ETHPrice = result[result.length-1][4];
//    console.log('preco atual do ethereum: ', ETHPrice);
// })


// then(dadosjson=>console.log(dadosjson[dadosjson.length-1][4]))
 // MetaMask requires requesting permission to connect users accounts



//se confirmado, sumir com os botões, mostrar tela de carregamento

//atualizar msgs a medida que a transação completa.

//completar transação, realizar um POST para o servidor

//posteriormente, manipular esse POST para que os dados salvos no servidor sejam salvos em um banco de dados.
