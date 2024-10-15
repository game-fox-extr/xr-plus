// Import Shopify Buy SDK
import Client from "shopify-buy";
import Swal from "sweetalert2";
// Initialize Shopify Client
const client = Client.buildClient({
  domain: "6696b8-78.myshopify.com", // Store domain
  storefrontAccessToken: "6cb2be504abda01d0e0a4efcc38342ac", // Storefront access token
});

var checkout = null;
const default_product_id = 8629642002644; // hoodie

class ShopifyBuy {
  constructor() {
    this.imageUrls = [];
    this.product = null;
    this.selectedSize = 0;

    // Create a checkout first
    this.initializeCheckout()
      .then(() => {
        // Now you can add line items once the checkout is initialized
        this.updatedCheckout = checkout;

        // // Fetch product details
        this.fetchProduct("gid://shopify/Product/" + default_product_id);
      })
      .catch((error) => {
        console.error("Error initializing checkout:", error);
      });
    this.updatedCheckout = checkout;

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
  }

  // Function to initialize or create a checkout
  async initializeCheckout() {
    try {
      // Create a new checkout
      checkout = await client.checkout.create();
    } catch (error) {
      console.error("Error creating checkout:", error);
    }
  }

  // Function to fetch product details
  async fetchProduct(productUrl) {
    try {
      // Fetch product details by Shopify Product ID
      this.product = await client.product.fetch(productUrl);

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
    const price = product.variants[0].price; // Assuming the first variant for simplicity
    this.imageUrls = [];
    product.images.forEach((image) => {
      this.imageUrls.push(image.src);
    });
    this.renderImages();

    // Inject the data into the HTML
    document.getElementById("product-title").textContent = title;
    document.getElementById("product-description").textContent = description;

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
      "https://cdn.shopify.com/3d/models/o/711e92d33971a568/chinese_Half_hand_shirt.glb";
    console.log("Product Id: " + this.product.id);
    if (this.product.id === "gid://shopify/Product/8629642002644") {
      src = "models/Sause Hoodie.glb";
    } else if (this.product.id === "gid://shopify/Product/8629583904980") {
      src = "models/Sause Tshirt New.glb";
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
        document
          .querySelector(".selected-size")
          .classList.remove("selected-size");
        sizeBtn.classList.add("selected-size");
        this.selectedSize = sizeBtn.value;
      });
    });
  }

  async addToCart(variantId) {
    try {
      // Add the product variant to the checkout
      const lineItemsToAdd = [];
      lineItemsToAdd.push({
        variantId: variantId,
        quantity: parseInt(document.getElementById("quantity").value),
      });

      this.updatedCheckout = await client.checkout.addLineItems(
        checkout.id,
        lineItemsToAdd
      );

      // Use SweetAlert instead of normal alert
      Swal.fire({
        title: "Success!",
        text:
          "Added " +
          String(document.getElementById("quantity").value) +
          " products to cart",
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
    try {
      // Redirect to the checkout page
      window.location.href = this.updatedCheckout.webUrl;
    } catch (error) {
      console.error("Error checking out:", error);
    }
  }
}

export const shopifyBuy = new ShopifyBuy(client);
