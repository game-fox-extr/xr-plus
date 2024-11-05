import Client from "shopify-buy";

class Item {
    constructor(product, variantId, quantity) {
        this.product = product;
        this.variantId = variantId;
        this.quantity = quantity;
    }
}
export class Cart {
    constructor() {
        this.itemList = [];
        this.checkout = null;

        // Create a Shopify Client
        this.client = Client.buildClient({
            domain: "gsv01y-gx.myshopify.com", // Store domain
            storefrontAccessToken: "b148c0911287ca8a6f23a6d7bab23110", // Storefront access token
        });

        // Create a checkout
        this.createCheckout().then(() => {
            //localStorage.clear();
            this.retrieveFromLocalStorage();

        });

        this.setupEventListeners();
    }

    async createCheckout() {
        try {
            this.checkout = await this.client.checkout.create();
        }
        catch (error) {
            console.error("Error creating checkout:", error);
        }
    }

    async add(product, variantId, quantity) {
        // Check if product variant already exists in itemList
        let index = -1;
        this.itemList.forEach((item, i) => {
            if (item.product.id === product.id && item.variantId === variantId) {
                index = i;
            }
        });
        if (index == -1) { // New to cart
            this.itemList.push(new Item(product, variantId, quantity));
        }
        else { // Item already exists
            this.itemList[index].quantity += quantity;
        }

        this.addToLocalStorage();

        // Updated Checkout
        try {
            await this.client.checkout.addLineItems(
                this.checkout.id,
                {
                    variantId: variantId,
                    quantity: quantity
                }
            );
        }
        catch (error) {
            console.error("Error Adding to the cart: ", error);
            throw error;
        }
    }

    async checkoutCart() {
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
        localStorage.setItem('cart', JSON.stringify(
            this.itemList.map((item) => (
                { productId: item.product.id, variantId: item.variantId, quantity: item.quantity }
            ))
        ));
    };

    retrieveFromLocalStorage = async () => {
        let localCart = JSON.parse(localStorage.getItem('cart')) || [];
        localCart = Object.values(localCart);
        for (const item of localCart) {
            if (item.productId && item.variantId && item.quantity){
                const product = await this.client.product.fetch(item.productId);
                await this.add(product, item.variantId, item.quantity);
            }
            else {
                this.itemList = [];
                break;
            }
        }
    };

    displayCart() {
        // Clear the cart items
        const cartItems = document.getElementById("cartItems");
        cartItems.innerHTML = "";

        // For every element in items list
        for (let index = 0; index < this.itemList.length; index++) {
            const item = this.itemList[index];
            const product = item.product;

            // Create a cart item div
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItems.appendChild(cartItem);

            // Add the html content
            const imageURL = product.images[0].src;
            const productName = product.title;
            const variant = product.variants.find((variant) => { return variant.id === item.variantId });
            const variantSize = variant.selectedOptions.find((option) => { return option.name.toLowerCase() === "size" }).value;
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
                    <p class="total-product-price" id="total-product-price-${index}">Rs. ${price}</p>
                </div>
            `;
        }

        this.recomputeCartPrice();

        // Make the cart visible
        document.getElementById("cart-container").style.display = "flex";
        document.getElementById("cartBackdrop").style.display = "flex";
    }

    closeCart() {
        document.getElementById("cart-container").style.display = "none";
        document.getElementById("cartBackdrop").style.display = "none";
    }

    setupEventListeners() {
        document.getElementById("cartIcon").addEventListener("click", () => {
            this.displayCart();
        });
        document.getElementById("cartCloseButton").addEventListener("click", async () => {
            await this.reloadCartArray();
            this.addToLocalStorage();
            this.closeCart();
            this.itemList = this.itemList.filter(item => item.quantity > 0);
        });
        document.getElementById("cartCheckoutButton").addEventListener("click", async () => {
            await this.reloadCartArray();
            this.addToLocalStorage();
            this.checkoutCart();
        });

        // Add event listeners for quantity buttons
        const cartItems = document.getElementById("cartItems");
        cartItems.addEventListener("click", (event) => {
            if (event.target.classList.contains("add-button")) {
                const i = event.target.getAttribute("data-index");
                const item = this.itemList[i];

                // Update quantity
                item.quantity += 1;
                document.getElementById(`qty-${i}`).textContent = this.itemList[i].quantity;

                // Update price
                const price = item.product.variants.find((variant) => { return variant.id === item.variantId }).price.amount;
                document.getElementById(`total-product-price-${i}`).textContent = `Rs. ${price * item.quantity}`;

                this.recomputeCartPrice();
            }
            else if (event.target.classList.contains("minus-button")) {
                const i = event.target.getAttribute("data-index");
                const item = this.itemList[i];

                if (this.itemList[i].quantity > 0) {
                    // Update quantity
                    item.quantity -= 1;
                    document.getElementById(`qty-${i}`).textContent = this.itemList[i].quantity;

                    // Update price
                    const price = item.product.variants.find((variant) => { return variant.id === item.variantId }).price.amount;
                    document.getElementById(`total-product-price-${i}`).textContent = `Rs. ${price * item.quantity}`;

                    this.recomputeCartPrice();
                }
            }
        });
    }

    async reloadCartArray() {
        // Clear the checkout first
        const checkout = await this.client.checkout.fetch(this.checkout.id);
        const lineItemIds = checkout.lineItems.map(item => item.id);
        await this.client.checkout.removeLineItems(this.checkout.id, lineItemIds);

        // Create a line items array from items list
        let lineItemsList = [];
        for (let i = 0; i < this.itemList.length; i++) {
            const item = this.itemList[i];
            lineItemsList.push({ variantId: item.variantId, quantity: item.quantity });
        }

        // Add items from items list into checkout
        await this.client.checkout.addLineItems(
            this.checkout.id,
            lineItemsList
        );
    }

    recomputeCartPrice() {
        // Recompute total price
        let totalPrice = 0;
        for (let index = 0; index < this.itemList.length; index++) {
            const item = this.itemList[index];
            const price = item.product.variants.find((variant) => { return variant.id === item.variantId }).price.amount;
            totalPrice += price * item.quantity;
        }
        document.getElementById("cartPrice").textContent = `Total: Rs. ${totalPrice}`;
    }
}