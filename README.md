# E-commerce-watch-deluxe
This is a hypothetical E-commerce page that I developed. The products are not real, and are just there for illustration.
However, there is a fully functional cart that allows users to add products, calculate the total, and send the user to a payment page where they can pay for the products using cryptocurrency.

I implemented the payment functionality using the Goerli test network, so there is no real money involved in the payment.

The website is online on: https://watchdeluxe.netlify.app/

The website is divided as follows:

## main page:

![main_page](https://user-images.githubusercontent.com/35705412/211091062-7d5afbbd-5907-41df-ac9a-83e702224091.png)

![mainpage2](https://user-images.githubusercontent.com/35705412/211091038-a732fcf4-2ac3-4199-a928-317839636152.png)

![mainPage3](https://user-images.githubusercontent.com/35705412/211091078-adefef2e-2419-43fc-9f41-8f94eb973747.png)

The main page is where the user can select the products that are going to be purchased. When selected, the products are added to the cart, the total is summed up, and the user can proceed or clear the cart.

## payment method selection:

![secondPage](https://user-images.githubusercontent.com/35705412/211091097-d3a49a11-e513-487b-b971-7541118862b5.png)

Here I included other options besides crypto. However, they are not functional because this would require interaction with the PayPal API or the API for some credit card systems, and this would not be viable to do in this test project.
So, if the user attempts to select any of them, a message will show up and tell the user that this payment method is not available.

## payment completion:

Payment completion is only possible if the user has the metamask extension installed. On this page, the total is going to be converted to ETH using the price available via the Binance API. And the payment is executed via the Goerli testnet, so that no real money can be expended.

![paymentFinal2](https://user-images.githubusercontent.com/35705412/211090951-ded4d9ae-e1ca-4916-80b4-2cf432139b91.png)

![finish](https://user-images.githubusercontent.com/35705412/211091428-7141cffc-eff9-4474-8a95-90489e2dfda3.png)
