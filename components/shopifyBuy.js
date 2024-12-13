// Import Shopify Buy SDK
import { Cart } from "./cart";
import Swal from "sweetalert2";

const default_product_id = 9658662650149; // hoodie

class ShopifyBuy {
    constructor() {
        this.imageUrls = [];
        this.product = null;
        this.selectedSize = 0;
        this.quantity = 0;

        // Create a cart
        this.cart = new Cart();

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add event listeners to add-to-cart & checkout buttons
        document.getElementById("add-to-cart").addEventListener("click", () => {
            this.addToCart(this.product.variants[this.selectedSize].id);
        });

        document.getElementById("checkout-btn").addEventListener("click", () => {
            this.checkoutCart();
        });

        document.getElementById("viewPhoto").addEventListener("click", () => {
            this.renderImages();
        });

        document.getElementById("view3dModel").addEventListener("click", () => {
            this.view3dModel();
        });

        // Add event listeners for increment and decrement buttons
        document.getElementById("increment-btn").addEventListener("click", () => {
            this.incrementQuantity();
        });

        document.getElementById("decrement-btn").addEventListener("click", () => {
            this.decrementQuantity();
        });
    }

    // Function to fetch product details
    async fetchProduct(productUrl) {
        try {
            // Fetch product details by Shopify Product ID
            this.product = await this.cart.client.product.fetch(productUrl);

            // Parse and display the product details
            this.displayProductDetails(this.product);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    }

    // Function to display product details in HTML
    displayProductDetails(product) {
        // Get the product title, description, and price, and images
        const title = product.title;
        const description = product.description;
        const price = product.variants[0].price.amount; // Assuming the first variant for simplicity
        const stockBool = product.availableForSale;
        this.imageUrls = [];
        product.images.forEach((image) => {
            this.imageUrls.push(image.src);
        });
        this.renderImages();

        // Inject the data into the HTML
        document.getElementById("product-title").textContent = title;
        document.getElementById("product-description").textContent = description;
        document.getElementById("product-price").textContent = `₹${price}`;
        document.getElementById("quantity").textContent = "1";
        if (stockBool) {
            document.getElementById("product-stock").textContent = "In Stock";
            document.getElementById("product-stock").color = "SpringGreen";
        } else {
            document.getElementById("product-stock").textContent = "Out Of Stock";
            document.getElementById("product-stock").color = "Tomato";
        }

        // Get the available sizes from the product's variants
        const availableSizes = [];
        product.variants.forEach((variant) => {
            availableSizes.push(
                variant.selectedOptions.find(
                    (option) => option.name.toLowerCase() === "size"
                ).value
            );
        });
        this.renderSizes(availableSizes);
    }

    view3dModel() {
        let src =
            "https://cdn.shopify.com/3d/models/o/8d4edf0f746458b9/chinese_Half_hand_shirt.glb";
        console.log("Product Id: " + this.product.id);
        if (this.product.id === "gid://shopify/Product/9658662650149") {
            src = "models/Sause Hoodie.glb";
        } else if (this.product.id === "gid://shopify/Product/9658662682917") {
            src = "models/Sause Tshirt.glb";
        }
        document.getElementById("productImageContainer").innerHTML = `
            <model-viewer src="${src}" alt="A 3D model of a product" auto-rotate camera-controls ar ar-modes="scene-viewer webxr quick-look" style="width: 100%; height: 100%;"></model-viewer>
        `;
    }

    renderImages() {
        document.getElementById("carousel-inner").innerHTML = "";
        this.imageUrls.forEach((url, index) => {
            const image = document.createElement("img");
            image.src = url;
            image.classList.add("carousel-image");
            document.getElementById("carousel-inner").appendChild(image);
        });
    }

    renderSizes(sizes) {
        const sizeOptionsContainer = document.querySelector(".size-options");
        sizeOptionsContainer.innerHTML = ""; // Clear previous sizes, if any
        this.selectedSize = 0;
        // Create a button for each size and append to size-options container
        sizes.forEach((size, index) => {
            const sizeBtn = document.createElement("button");
            sizeBtn.classList.add("size-option");
            sizeBtn.textContent = size; // Set the text to the size
            sizeBtn.value = index;
            sizeOptionsContainer.appendChild(sizeBtn); // Append to the container

            // Initially selected size
            if (index === this.selectedSize) sizeBtn.classList.add("selected-size");

            // When a button is pressed
            sizeBtn.addEventListener("click", (event) => {
                document.querySelector(".selected-size").classList.remove("selected-size");
                document.getElementById("quantity").textContent = "1";
                sizeBtn.classList.add("selected-size");
                this.selectedSize = sizeBtn.value;
            });
        });
    }

    // Function to increment quantity
    incrementQuantity() {
        let quantity = parseInt(document.getElementById("quantity").textContent);
        if (quantity < 5) {
            document.getElementById("quantity").textContent = String(quantity + 1);
        }
    }

    // Function to decrement quantity
    decrementQuantity() {
        let quantity = parseInt(document.getElementById("quantity").textContent);
        if (quantity > 1) {
            document.getElementById("quantity").textContent = String(quantity - 1);
        }
    }

    async addToCart(variantId) {
        try {
            let qty = parseInt(document.getElementById("quantity").textContent);
            console.log(this.product, variantId, qty);
            await this.cart.add(this.product, variantId, qty);

            // Use SweetAlert instead of normal alert
            Swal.fire({
                title: "Success!",
                text:
                    "Added " + document.getElementById("quantity").textContent + " products to cart",
                icon: "success",
                button: "OK",
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to add product to cart. Please try again.",
                icon: "error",
                button: "OK",
            });
        }
    }

    async checkoutCart() {
        this.cart.checkoutCart();
    }
}

export const shopifyBuy = new ShopifyBuy();
