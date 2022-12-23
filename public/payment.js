//get screen elements
const userTotal = document.querySelector(".user-total");
const userName = document.querySelector('.username');
const productList = document.querySelector('.items-list');
const showMenuBtn = document.querySelector('.nav-icon');
const MenuDOM = document.querySelector('.menu');
const hideMenuDOM = document.querySelector('.hide-menu');

//payment methods
const paymentMethods = document.querySelector(".payment-methods");
const methods = document.querySelectorAll(".payment-method");
let paymentSelected;
//cancel and next button
const nextButton = document.querySelector(".finish-payment");
const cancelButton = document.querySelector(".cancel-payment");

//disale nexButton by standard
let userCanAdvance = false;
//functions to get cart data
const dataFromStorage = ()=>{
    return localStorage.getItem('userAndTotalValue')?JSON.parse(localStorage.getItem('userAndTotalValue')):[]
}

const productsFromStorage =  ()=>{
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
}

//set the result of these functions to variables.
const data = dataFromStorage();
const products = productsFromStorage();

//define function to transform item in div
function createDivFromItem(item){
    const div = document.createElement('div');
    // configure the div properties
    div.classList.add('shopping-item');
    div.innerHTML = '<div class="img-container"><img src='+ item.image +' alt="product-'+ item.id + '"/></div><div class="item-name"> <h5>'+ item.title+'</h5><div class="item-info"><span>$'+item.price+'</span><span class= "qtde">quantity: '+item.amount+'</span></div></div>'
    productList.appendChild(div);
}

//show and hide menu
function showMenu(){
    MenuDOM.classList.add('showMenu');
}

function HideMenu(event){
    if(event.target.classList.contains("hide-menu") || event.target.classList.contains("fa-solid")){
        MenuDOM.classList.remove('showMenu');
    }
}

function selectPayment(paymentDOMElement){

    //look to the paymet container class
    let foundLi = false;
    let Li = paymentDOMElement;
    Li = Li.parentNode;
   
    //implement do while
    while(foundLi ===false){
        if (Li.classList.contains("payment-method")){
            foundLi =true;
        }
        else{
            Li = Li.parentNode;
        }
    }

    //remove the selected styling if present.
    methods.forEach(method =>{
        if(method.classList.contains('payment-selected')){
            method.classList.remove('payment-selected');
        }
    })

    //apply the class selected .payment-selected
    Li.classList.add('payment-selected');

    //make the button clicable
    if (nextButton.disabled === true){
        nextButton.disabled =false;
    }

}

//payment selection functionality
paymentMethods.addEventListener('click', event =>{
    let selectedMethod = event.target;

    if (selectedMethod.classList.contains("PayPal")){
        console.log('paypal');
        //enable next button

        // selectPayment(selectedMethod);
        paymentSelected = "payPal";
        alert('Sorry, this payment method is not available in the moment');


        //add the selected class

        //remove the selected class from other payments.
    }

    else if(selectedMethod.classList.contains("creditCard")){
        console.log('credit card');
        // selectPayment(selectedMethod);
        paymentSelected = "creditCard";
        alert('Sorry, this payment method is not available in the moment');

    }
    else if (selectedMethod.classList.contains("crypto")){
        console.log('crypto');


        //check if injected metamask;

        if(window.ethereum && window.ethereum.isMetaMask){
            selectPayment(selectedMethod);
            paymentSelected = "crypto";
            userCanAdvance = true;
            
        }
        else{
            alert('To use this payment method is necessary to have a metamask wallet installed in your browser !!')
        }
        
    }
    //end crypto
})


//set menu event listeners
showMenuBtn.addEventListener('click', showMenu);
hideMenuDOM.addEventListener('click', event => this.HideMenu(event));

nextButton.addEventListener('click', ()=>{
    if(userCanAdvance){ 
        localStorage.setItem("paymentMethod", paymentSelected);
        //save in local storage the payment method selected.
        window.location.href = './crypto_payment.html'

    }
    else{
        alert('please select a payment method');

    }
});

cancelButton.addEventListener('click',()=>{
    if (localStorage.getItem('paymentMethod')){
        localStorage.removeItem('paymentMethod');
    }
    window.location.href = './index.html';
})

//setupp the page elements when loaded
document.addEventListener('DOMContentLoaded', ()=>{
    //set in the inner text from the user and total
    userName.innerHTML += data.user;
    userTotal.innerHTML = '$ ' + data.total.toString();

    //get the list of items from the localStorage
    console.log(products);

    //for each item, create a div.
    products.map(product => createDivFromItem(product));

})
