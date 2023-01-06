# E-commerce-watch-deluxe
This a hipotetical E-commerce page that i developed. The products are not real, and are just there for ilustration.
However, there is a fully functional cart that allows user to add products, calculate the total and send the user to a payment page where the user can pay for the products using cryptocurrency.
I implemented the payment functionality using the goerli test network so there is no real money involved in the payment.


The website is divided as follows:

*main page:

The main page is where the user can select the products that are gonna be purchased. When selected the products are adeded to the cart the total is summed and the user can proceed or clear the cart.

*payment method selection:

Here I included other options besides crypto, however they are not functional because this would require interaction with the paypal API or the API for some credit card system, and this would not be viable to do in this test project.
So if the user atempts to select any of them, a message will show up and tell the user that this payment method is not available.

*payment completion:
The payment completion is only possible if the user have the metamask extension installed. In this page the total is going to be converted to ETH using the price available via the Binance API.And the payment is executed via the Goerli testnet, so that no real money can be expended.

