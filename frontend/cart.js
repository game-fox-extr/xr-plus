import Client from "shopify-buy";

class Item{
    constructor(productId, variantId, quantity){
        this.productId = productId;
        this.variantId = variantId;
        this.quantity = quantity;
    }
}
export class Cart{
    constructor(){
        this.itemList = [];
        this.checkout = null;
        
        // Create a Shopify Client
        this.client = Client.buildClient({
            domain: "gsv01y-gx.myshopify.com", // Store domain
            storefrontAccessToken: "b148c0911287ca8a6f23a6d7bab23110", // Storefront access token
        });

        // Create a checkout
        this.createCheckout();
    }

    async createCheckout(){
        try{
            this.checkout = await this.client.checkout.create();
        }
        catch (error) {
            console.error("Error creating checkout:", error);
        }
    }

    addToLocalStorage = () => {
        localStorage.setItem('cart', JSON.stringify(this.itemList)) ;
    };

    retrieveFromLocalStorage = () => {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        this.itemList = localCart;
    };

    async add(productId, variantId, quantity){
        // Check if product variant already exists in itemList
        let index = -1;
        this.itemList.forEach((item, i) => {
            if(item.productId === productId && item.variantId === variantId){
                index = i;
            }
        });
        if(index == -1){ // New to cart
            this.itemList.push(new Item(productId, variantId, quantity));
        }
        else{ // Item already exists
            this.itemList[index].quantity += quantity;
        }

        this.addToLocalStorage();

        // Updated Checkout
        try{
            this.checkout = await this.client.checkout.addLineItems(
                this.checkout.id,
                {
                    variantId: variantId,
                    quantity: quantity
                }
            );
        }
        catch(error){
            console.error("Error Adding to the cart: ", error);
        }
    }

    async checkoutCart(){
        try {
            // Redirect to the checkout page
            window.open(this.checkout.webUrl, "_blank");
        }
        catch (error) {
            console.error("Error checking out:", error);
        }
    }

    displayCart(){
        c
    }
}