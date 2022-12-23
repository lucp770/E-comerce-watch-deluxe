// variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-btn');
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems= document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent= document.querySelector(".cart-content");
const productDOM = document.querySelector(".products-center");
const showMenuBtn = document.querySelector('.nav-icon');
const MenuDOM = document.querySelector('.menu');
const hideMenuDOM = document.querySelector('.hide-menu');
const finishShoppingBtn = document.querySelector('.finish-shopping');
const shopButton = document.querySelector('.banner-btn');
const shoppingDiv= document.querySelector('.products');

// array that stores the items of the cart
let cart = [];
let buttonsDOM = [];

// get the product
class Product{

	async getProduct(){
		try{
			let result = await fetch('./resources/products2.json');
			let data = await result.json();

			let products = data.items;
			products = products.map(item => {
				const {title,price} = item.fields;
				const {id} = item.sys;
				const image = item.fields.image.fields.file.url;
				return {title, price, id, image};
			})

			return products;

		} catch (error){
			console.log(error);
	}

	}

}

// display product
class UI{
	displayProducts(products){
		let result = '';
		products.forEach(product => {
			// now lets insert a product in the div product-center
			result = result +'<article class="product"><div class="img-container"><img src= '+ product.image + ' alt="product-1" class="product-img"/><button class="bag-btn" data-id =' + product.id + '><i class="fas fa-shopping-cart"></i>add to cart</button><h3>' + product.title + '</h3><h4> $' + product.price +'</h4></div></article>'
					});
		productDOM.innerHTML = result;
	}

	getBagButtons(){
		const btns = [...document.querySelectorAll(".bag-btn")];
		btns.forEach(button =>{
			let id = button.dataset.id;
			// se já esta no cart é necessário aumentar o numero e não repetir a inserção.
			let inCart = cart.find(item => item.id=== id);
			if (inCart){
				button.innerText = "In Cart";
				button.disabled = true;

			}
			buttonsDOM = [...btns];
			
			button.addEventListener('click',(event)=>{
					// event is an object with various propretires
			event.target.innerText = "In Cart";
			event.target.disabled = true;

			// get the product from products (this returns product with all the data from the local storage)
			let cartItem =Storage.getProduct(id);
			// update cartItem object to include the amount:
			cartItem = {...cartItem, amount: 1}
			
			
			// add product to the cart
			cart = [...cart ,cartItem];
			
			// save cart in local storage
			Storage.saveCart(cart);
			
			// set cart values

			this.setCartValues(cart);
			// display cart item.
			this.addCartItem(cartItem);

			// show cart
			this.showCart();

				})
			
		})

	}

	setCartValues(cart){
		let tempTotal  =0;
		let itemsTotal =0;
		cart.map(item => {
			tempTotal += item.price*item.amount;
			itemsTotal += item.amount;
		});

		cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
		cartItems.innerText = itemsTotal;
		console.log(cartTotal, cartItems);

	}

	addCartItem(item){
	
		const div = document.createElement('div');
		div.classList.add('cart-item');
		div.innerHTML = '<img src =' + item.image + ' alt ="product" /><div><h4>' + item.title + '</h4><h5> $' + item.price + '</h5><span class="remove-item" data-id = ' + item.id + '>remove item</span></div><div><i class="fas fa-chevron-up" data-id = ' + item.id + ' ></i><p class="item-amount">1</p><i class="fas fa-chevron-down" data-id = ' + item.id + '></i></div>'
		cartContent.appendChild(div);
	}

	showCart(){
		cartOverlay.classList.add('transparentBcg');
		cartDOM.classList.add('showCart');
		if (cart.length ===0){
			//disable the button
			finishShoppingBtn.classList.add('disabled-button');
			clearCartBtn.classList.add('disabled-button');
			finishShoppingBtn.disable = true;
		}
		else{
			finishShoppingBtn.classList.remove('disabled-button');
			clearCartBtn.classList.remove('disabled-button');
			finishShoppingBtn.disable = false;
		}
		
	}

	hideCart(){
		cartOverlay.classList.remove('transparentBcg');
		cartDOM.classList.remove('showCart');
	}

	// this method setup the cart with the data stored in the moment that the page is loaded
	setUpAPP(){
		// insert the event listener for the clossing cart button.
		cart = Storage.getCart();
		this.setCartValues(cart);
		// fill the cart if there are values in the local storage.

		// add the itens in the cart html
		this.populate(cart);
		console.log('app setup', cart.length);
		if (cart.length ===0){
			console.log('condicao satisfeita');
			//disable the button
			finishShoppingBtn.classList.add('disabled-button');
			clearCartBtn.classList.add('disabled-button');
			finishShoppingBtn.disable = true;
		}
		else{
			console.log('cart nao vazio');
			finishShoppingBtn.classList.remove('disabled-button');
			clearCartBtn.classList.remove('disabled-button');
			finishShoppingBtn.disable = false;
		}

		// add the event listeners for the buttons
		cartBtn.addEventListener('click', this.showCart);
		closeCartBtn.addEventListener('click', this.hideCart);
		showMenuBtn.addEventListener('click', this.showMenu);
		hideMenuDOM.addEventListener('click', event => this.HideMenu(event));
		finishShoppingBtn.addEventListener('click', this.openFinishShoppingPage);
		//need to insert a callback to manipulate the DOM.
		shopButton.addEventListener('click',event => this.scrollToShopping());
	}

	scrollToShopping(){
		console.log('clicado');
		shoppingDiv.scrollIntoView({behavior: "smooth"});
	}

	openFinishShoppingPage(){
		//open new page, save logged user and total in local storage.

		if(finishShoppingBtn.disable === false){
		//remove the line bellow after user authentication is i place.
		const user = "Standard User";
		const total  = {user: user, total: parseFloat(cartTotal.innerText)};
		localStorage.setItem("userAndTotalValue",JSON.stringify(total));
		window.location.href = './payment_page.html';
		}
		
	}

	showMenu(){
		MenuDOM.classList.add('showMenu');
	}

	HideMenu(event){
		if(event.target.classList.contains("hide-menu") || event.target.classList.contains("fa-solid")){
			MenuDOM.classList.remove('showMenu');
		}
	}

	populate(cart){
		cart.forEach(item => this.addCartItem(item));

	}

	cartLogic(){
		clearCartBtn.addEventListener('click',() => {
			this.clearCart();
		});

		cartContent.addEventListener('click', event => {
			// checks whether the target of the click is the remove text
			if (event.target.classList.contains("remove-item")) {
				let removeItem = event.target;
				let id = removeItem.dataset.id;
				// remove from the cart
				this.removeItem(id);

				// remove from the DOM
				cartContent.removeChild(removeItem.parentElement.parentElement);
			}

			else if (event.target.classList.contains("fa-chevron-up")){
				let addAmount = event.target;
				let id = addAmount.dataset.id;
				let tempItem = cart.find(item => item.id ===id);
				tempItem.amount = tempItem.amount +1;
				// update the class on the localStorage
				Storage.saveCart(cart);

				// update the calculated values
				this.setCartValues(cart);

				// get the paragraph that comes after the up button and change the value
				addAmount.nextElementSibling.innerText = tempItem.amount;

			}

			else if (event.target.classList.contains("fa-chevron-down")){
				let lowerAmount = event.target;
				let id = lowerAmount.dataset.id;
				let tempItem = cart.find(item => item.id ===id);

				tempItem.amount = tempItem.amount - 1;
				if(tempItem.amount > 0){
					// just update the values
					Storage.saveCart(cart);
					this.setCartValues(cart);
					lowerAmount.previousElementSibling.innerText = tempItem.amount;

				}
				else{
					// otherwise remove from the DOM
					cartContent.removeChild(lowerAmount.parentElement.parentElement);
					this.removeItem(id);
					// also needs to update the bag button
					if (cart.length ===0){
				
						//disable the button
						finishShoppingBtn.classList.add('disabled-button');
						clearCartBtn.classList.add('disabled-button');
						finishShoppingBtn.disable = true;
					}
					else{
				
						finishShoppingBtn.classList.remove('disabled-button');
						clearCartBtn.classList.remove('disabled-button');
						finishShoppingBtn.disable = false;
					}
				}

			}
		});
		
	}

	clearCart(){
		let cartItems = cart.map(item => item.id);
		cartItems.forEach(id => this.removeItem(id));
		// check if the children object is greater than zero, and continue to remove 
		// if it is.
		while(cartContent.children.length > 0){
			cartContent.removeChild(cartContent.children[0]);

		}

		this.hideCart();
	
	}

	removeItem(id){
		cart = cart.filter(item => item.id !== id);
		this.setCartValues(cart);
		Storage.saveCart(cart);
		let button = this.getSingleButton(id);

		// change the text of the button to be 'add to cart'
		button.disabled = false;
		button.innerHTML = '<i class ="fas fa-shopping-cart"></i>add to cart'
		if (cart.length ===0){
			console.log('condicao satisfeita');
			//disable the button
			finishShoppingBtn.classList.add('disabled-button');
			clearCartBtn.classList.add('disabled-button');
			finishShoppingBtn.disable = true;
		}
		else{
			console.log('cart nao vazio');
			finishShoppingBtn.classList.remove('disabled-button');
			clearCartBtn.classList.remove('disabled-button');
			finishShoppingBtn.disable = false;
		}

	}

	getSingleButton(id){
		return buttonsDOM.find(button => button.dataset.id === id);
	}
}

// local storage
class Storage{
	// create a static method to be acessed without need for instantiation
	static saveProducts(products){
		// a maior parte dos navegadores tem uma storage local que onde algumas requisições do servidor
		// localStorage está disponível no objeto window.
		// podem ser salvas para uso futuro. Esse objeto é o localStorage, e pode ser acessado através do Js.
		// Os dados são mantidos até que o usuario limpe o cache do navegador.
		localStorage.setItem("products",JSON.stringify(products));
	
	}

	static saveCart(cart){
		localStorage.setItem("cart", JSON.stringify(cart));
	}

	static getProduct(id){
		let products = JSON.parse(localStorage.getItem('products'));
		return products.find(product => product.id ===id);

	}

	static getCart(){
		return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
	}
}

document.addEventListener("DOMContentLoaded",() =>{
	const ui = new UI();
	const products = new Product();

	// setupp Application
	ui.setUpAPP();

	// get the products, we use two thens to be able to acess the buttons after they are generated.
	products.getProduct().then(data => {
	ui.displayProducts(data);
	Storage.saveProducts(data);//this saves the data in the browser local storage.
	}).then(()=>{
		ui.getBagButtons();
		ui.cartLogic();
	});
	
})





