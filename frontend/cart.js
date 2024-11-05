import Client from "shopify-buy";

class Item{
    constructor(product, variantId, quantity){
        this.product = product;
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
        this.createCheckout().then(() => {
            // this.retrieveFromLocalStorage(); commented temporarily
        });

        this.setupEventListeners();
    }

    async createCheckout(){
        try{
            this.checkout = await this.client.checkout.create();
        }
        catch (error) {
            console.error("Error creating checkout:", error);
        }
    }

    async add(product, variantId, quantity){
        // Check if product variant already exists in itemList
        let index = -1;
        this.itemList.forEach((item, i) => {
            if(item.product.id === product.id && item.variantId === variantId){
                index = i;
            }
        });
        if(index == -1){ // New to cart
            this.itemList.push(new Item(product, variantId, quantity));
        }
        else{ // Item already exists
            this.itemList[index].quantity += quantity;
        }

        // this.addToLocalStorage(); commented for now

        // Updated Checkout
        try{
            await this.client.checkout.addLineItems(
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

    // Storing cart values locally
    addToLocalStorage = () => {
        localStorage.setItem('cart', JSON.stringify(this.itemList)) ;
    };

    retrieveFromLocalStorage = async () => {
        let localCart = JSON.parse(localStorage.getItem('cart')) || [];
        localCart = Object.values(localCart);
        for (const item of localCart){
            if(item.productId && item.variantId && item.quantity)
            await this.add(item.productId, item.variantId, item.quantity);
            else{
                this.itemList = [];
                break;
            }
        }
    };

    displayCart(){
        // // Make cart visible
        // const cart = document.getElementById("cart-container");
        // const cartBackdrop = document.getElementById("cartBackdrop");
        // cart.style.display = "flex";
        // cartBackdrop.style.display = "block";

        // // Load the cart items
        // const cartItems = document.getElementById("cartItems");
        // cartItems.innerHTML = "";
        
        // for (const index in this.itemList) {
        //     // Product and variant
        //     const item = this.itemList[index];
        //     const product = item.product;
        //     let productVariant = null;
        //     product.variants.forEach((variant) => {
        //         if(variant.id === item.variantId){
        //             productVariant = variant;
        //         }
        //     });

        //     const imageURL = product.images[0].src;
        //     const productName = product.title;
        //     const variantSize = productVariant.selectedOptions.find(
        //         (option) => option.name.toLowerCase() === "size"
        //     ).value;
        //     const qty = item.quantity;
        //     const price = item.quantity * productVariant.price.amount;
            
        //     console.log("Variant: ", productVariant);
            
        //     cartItems.innerHTML += `
        //         <div class="cart-item">
        //             <img src="${imageURL}" alt="Product Image" class="cart-item-image">
        //             <div class="cart-details">
        //                 <p class="product-name">${productName}</p>
        //                 <p class="variant-size">${variantSize}</p>
        //                 <div class="qty-modifier">
        //                     <p class="minus-button" id="minus-button-${index}">-</p>
        //                     <p class="qty" id="qty-${index}">${qty}</p>
        //                     <p class="add-button" id="add-button-${index}">+</p>
        //                 </div>
        //                 <p class="total-product-price">Rs. ${price}</p>
        //             </div>
        //         </div>
        //     `;

        //     document.getElementById(`minus-button-${index}`).addEventListener("click", () => {
        //         const qtyElement = document.getElementById(`qty-${index}`);
        //         if(item.quantity > 0){
        //             item.quantity -= 1;
        //             qtyElement.textContent = `${item.quantity}`;
        //         }
        //     });

        //     document.getElementById(`add-button-${index}`).addEventListener("click", () => {
        //         const qtyElement = document.getElementById(`qty-${index}`);
        //         item.quantity += 1;
        //         qtyElement.textContent = `${item.quantity}`;
        //     });

        // }

        // Clear the cart items
        const cartItems = document.getElementById("cartItems");
        cartItems.innerHTML = "";

        // For every element in items list
        for(let index = 0; index < this.itemList.length; index++){
            const item = this.itemList[index];
            const product = item.product;

            // Create a cart item div
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItems.appendChild(cartItem);

            // Add the html content
            const imageURL = product.images[0].src;
            const productName = product.title;
            const variant = product.variants.find((variant) => {return variant.id === item.variantId});
            const variantSize = variant.selectedOptions.find((option) => {return option.name.toLowerCase() === "size"}).value;
            const price = variant.price.amount;
            const qty = item.quantity;
            cartItem.innerHTML = `
                <img src="${imageURL}" alt="Product Image" class="cart-item-image">
                <div class="cart-details">
                    <p class="product-name">${productName}</p>
                    <p class="variant-size">${variantSize}</p>
                    <div class="qty-modifier">
                        <p class="minus-button" data-index=${index}>-</p>
                        <p class="qty" id="qty-${index}">${qty}</p>
                        <p class="add-button" data-index=${index}>+</p>
                    </div>
                    <p class="total-product-price">Rs. ${price}</p>
                </div>
            `;
        }

        // Add event listeners for quantity buttons
        cartItems.addEventListener("click", (event) => {
            if(event.target.classList.contains("add-button")){
                const i = event.target.getAttribute("data-index");
                this.itemList[i].quantity += 1;
                document.getElementById(`qty-${i}`).textContent = parseInt(this.itemList[i].quantity);
            }
            else if(event.target.classList.contains("minus-button")){
                const i = event.target.getAttribute("data-index");
                if(this.itemList[i].quantity > 0){
                    this.itemList[i].quantity -= 1;
                    document.getElementById(`qty-${i}`).textContent = parseInt(this.itemList[i].quantity);
                }
            }
        });

        // Make the cart visible
        document.getElementById("cart-container").style.display = "flex";
        document.getElementById("cartBackdrop").style.display = "flex";
    }

    closeCart(){
        document.getElementById("cart-container").style.display = "none";
        document.getElementById("cartBackdrop").style.display = "none";
    }

    setupEventListeners(){
        document.getElementById("cartIcon").addEventListener("click", () => {
            this.displayCart();
        });
        document.getElementById("cartCloseButton").addEventListener("click", async() => {
            await this.reloadCartArray();
            this.closeCart();
        });
        document.getElementById("cartCheckoutButton").addEventListener("click", async() => {
            await this.reloadCartArray();
            this.checkoutCart();
        });
    }

    async reloadCartArray(){
        // Clear the checkout first
        const checkout = await this.client.checkout.fetch(this.checkout.id);
        const lineItemIds = checkout.lineItems.map(item => item.id);
        await this.client.checkout.removeLineItems(this.checkout.id, lineItemIds);
        
        // Add items from items list into checkout
        let items = Array.from(this.itemList);
        this.itemList.length = 0;
        for(let index = 0; index < items.length; index++){
            const item = items[index];
            await this.add(item.product, item.variantId, item.quantity);
            console.log("Product: ", item.product.title, "Quantity: ", item.quantity);
        }
    }
}