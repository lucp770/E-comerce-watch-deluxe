//_________________// get DOM elements //___________________________//

const totalContainer = document.querySelector('.user-total-container');
const informText = document.querySelector('.information-banner');
const userTotal = document.querySelector('.user-total');

const showMenuBtn = document.querySelector('.nav-icon');
const MenuDOM = document.querySelector('.menu');
const hideMenuDOM = document.querySelector('.hide-menu');

const confirmPayment = document.querySelector('.finish-payment');
const cancelPayment = document.querySelector('.cancel-payment');
const footer = document.querySelector('.final-footer');

let ETHPrice;

//----------------get data from localStorage:----------------//

//user and total
const {user, total} = JSON.parse(localStorage.getItem('userAndTotalValue'));

//------------------------loading total in usdt and checking metamask.-----------------------------

async function executeTransaction(sender, recipient, total, gasPrice,signer_provider){
  
    const signer = await signer_provider.getSigner();

    transaction_nounce = await signer_provider.getTransactionCount(sender,'latest');

   const tx = {
      to: recipient,
      value: ethers.utils.parseEther(total),
      gasPrice: ethers.utils.parseUnits(gasPrice, "ether"),
      // gasLimit: ethers.utils.hexlify(100000), //100 000 gwei
      // nounce: transaction_nounce
   };

   const transaction = await signer.sendTransaction(tx);

   console.log('transaction executed.... \n', transaction)

   console.log('\n transaction in execution .....');

   //insert here the page loading., alter the inner html do final footer.

   generateLoader();

   const confirmedTransaction = await transaction.wait()

   console.log('\n confirmed transaction : ', confirmedTransaction);
   let txHash = confirmedTransaction.transactionHash;

   generateConclusionMessage(txHash);

   return confirmedTransaction;

}

 async function getAdress(){

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

      let totalEth = await price/ethToUSDT;
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

   getEthPrice(total).then( async ({totalEth, ethToUSDT}) =>{
   let text = totalEth.toFixed(7).toString();
   let totalNoGas = totalEth.toString();

   //calculate the total gas
     let totalGas  = await signer_provider.estimateGas({
      to: '0x7A77e531E1e7444027817356f2dCf5349fEd2e84', 
      value: ethers.utils.parseEther(text)
   })
     totalGas=totalGas.toNumber();

   //calculate the estimated transaction fee
   const transactionFee = totalGas*gasPrice;
   console.log('fee: ', transactionFee);

   //
   text = (transactionFee+totalEth).toFixed(7).toString();

   //total in dolars
   let newTotal = total + transactionFee/ethToUSDT;

   localStorage.setItem("TotalInETHWithGas",JSON.stringify(text));
   localStorage.setItem("TotalInETH",JSON.stringify(totalNoGas));
   //set the inner html

   userTotal.innerHTML = text +' ETH' + ' ( $'+ newTotal.toFixed(2) +' )';
   confirmPayment.classList.remove('disabled-button');

   //ativar os botões

   })
}

function showMenu(){
      MenuDOM.classList.add('showMenu');
   }

function HideMenu(event){
      if(event.target.classList.contains("hide-menu") || event.target.classList.contains("fa-solid")){
         MenuDOM.classList.remove('showMenu');
      }
   }

function generateLoader(){
    footer.innerHTML = '<div class = "loader"></div><p> waiting for the transaction to be mined on the blockchain ...</p>';
}

function generateConclusionMessage(txHash){
   let link = 'https://goerli.etherscan.io/tx/'+txHash;
   footer.innerHTML = '<h2> Transaction fineshed </h2><p class = "final-msg"> The transactoin can be verified on <a href = "'+link+'">Etherscan</a></p><button class="final-button cancel-payment">Finish</button>'
   //add the event listener for final button.

   const finalButton = document.querySelector('.final-button');
   finalButton.addEventListener('click', ()=>{
       window.location.href = './index.html';
   })
}
document.addEventListener('DOMContentLoaded',fillDom);
// document.addEventListener('DOMContentLoaded',generateConclusionMessage('0x156620150b364435efcc05fb73568f99a37b52a2ff12836499e932075322f0e8'));

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
  
   //get the gas price:
   let gasPrice = await signer_provider.getGasPrice();
   //convert gasPrice to ether.
   gasPrice =  ethers.utils.formatUnits(gasPrice,'ether');

   //check if connected to the goerli network, if connected then execute the transaction, otherwise throw an error.
   const {chainId} = await signer_provider.getNetwork();
   console.log('network', chainId);

   if(chainId ===5){
  

      console.log('executing transaction ....');
      try{

       let transaction = await executeTransaction(sender, recipient, newTotal, gasPrice, signer_provider);

      }
      catch(e){
         alert('An error has ocurred during the transaction: \n \n'+ e);
         console.log(e);
      }
     
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

showMenuBtn.addEventListener('click', showMenu);
hideMenuDOM.addEventListener('click', event => HideMenu(event));



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
