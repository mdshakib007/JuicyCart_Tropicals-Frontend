document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product_id");

    if (!productId) {
        window.location.href = "index.html";
        return;
    }

    // Fetch product details
    fetch(`https://juicycart-tropicals.onrender.com/listing/products/?product_id=${productId}`)
        .then(res => res.json())
        .then(data => {
            if (data.results.length > 0) {
                const product = data.results[0];

                // Populate product details
                document.getElementById("product-image").src = product.image;
                document.getElementById("product-name").innerText = product.name;
                document.getElementById("product-price").innerText = `$${product.price}`;
                document.getElementById("product-availability").innerText = `Available: ${product.available}`;
                document.getElementById("product-sold").innerText = `Sold: ${product.sold}`;
                document.getElementById("product-about").innerText = product.about;

                // Fetch category details and then fetch related products
                fetch(`https://juicycart-tropicals.onrender.com/listing/categories/?category_id=${product.category}`)
                    .then(res => res.json())
                    .then(categoryData => {
                        if (categoryData.length > 0) {
                            document.getElementById("product-category").innerHTML = `Category: <span class="border border-green-500 text-green-500 rounded-lg p-1">${categoryData[0].name}</span>`;
                            // Fetch related products after getting category details
                            fetchRelatedProducts(product.category, product.id);
                        }
                    });

                // Fetch shop details
                fetch(`https://juicycart-tropicals.onrender.com/shop/list/?shop_id=${product.shop}`)
                    .then(res => res.json())
                    .then(shopData => {
                        if (shopData.length > 0) {
                            document.getElementById("product-shop").innerHTML = `Shop: <span class="text-green-500 underline">${shopData[0].name}</span>`;
                        }
                    });

                // Hide the order section if the product is unavailable
                if (product.available < 1) {
                    document.getElementById("order-section").style.display = "none";
                    document.getElementById("product-unavailable").classList.remove("hidden");
                }
            } else {
                // If the product is not found, redirect or show an error
                window.location.href = "index.html";
            }
        })
        .catch(err => {
            console.error("Error fetching product details:", err);
            // Optionally display an error message here
        });
});

// Function to fetch related products based on category, excluding the current product, limited to 3
function fetchRelatedProducts(categoryId, currentProductId) {
    fetch(`https://juicycart-tropicals.onrender.com/listing/products/?category_id=${categoryId}`)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                // Exclude the current product
                let related = data.results.filter(p => p.id != currentProductId);
                // Limit to at most 3 related products
                related = related.slice(0, 3);
                displayRelatedProducts(related);
            }
        })
        .catch(err => {
            console.error("Error fetching related products:", err);
        });
}


function displayRelatedProducts(products) {
    const container = document.getElementById("products");
    if (products[0]) {
        div = document.createElement("div");
        div.classList.add("flex", "border-t", "border-gray-200", "p-2", "cursor-pointer");
        div.onclick = () => {
            window.location.href = `single_product.html?product_id=${products[0].id}`;
        };
        div.innerHTML = `
            <img src="${products[0].image}" alt="" class="w-16 h-16">
            <div class="ms-3">
                <h3 class="text-md font-bold">${products[0].name}</h3>
                <p class="text-green-500">${products[0].available} in Stock</p>
                <h5 class="text-md font-bold text-red-500">$${products[0].price}</h5>
            </div>
        `;
        container.appendChild(div);
    }
    if (products[1]) {
        div = document.createElement("div");
        div.classList.add("flex", "border-t", "border-gray-200", "p-2", "cursor-pointer");
        div.onclick = () => {
            window.location.href = `single_product.html?product_id=${products[1].id}`;
        };
        div.innerHTML = `
            <img src="${products[1].image}" alt="" class="w-16 h-16">
            <div class="ms-3">
                <h3 class="text-md font-bold">${products[1].name}</h3>
                <p class="text-green-500">${products[1].available} in Stock</p>
                <h5 class="text-md font-bold text-red-500">$${products[1].price}</h5>
            </div>
        `;
        container.appendChild(div);
    }
    if (products[2]) {
        div = document.createElement("div");
        div.classList.add("flex", "border-t", "border-gray-200", "p-2", "cursor-pointer");
        div.onclick = () => {
            window.location.href = `single_product.html?product_id=${products[2].id}`;
        };
        div.innerHTML = `
            <img src="${products[2].image}" alt="" class="w-16 h-16">
            <div class="ms-3">
                <h3 class="text-md font-bold">${products[2].name}</h3>
                <p class="text-green-500">${products[2].available} in Stock</p>
                <h5 class="text-md font-bold text-red-500">$${products[2].price}</h5>
            </div>
        `;
        container.appendChild(div);
    }
};

function orderProduct(event) {
    event.preventDefault();

    // Show loading spinner (or disable the button)
    const orderBtn = document.getElementById("order-btn");
    orderBtn.innerHTML = `<span class="loading loading-spinner loading-xs"></span>`;

    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!user_id || !token) {
        window.location.href = "./login.html";
        return;
    }

    // Get the product id from the URL
    const params = new URLSearchParams(window.location.search);
    const product_id = params.get("product_id");
    const quantity = document.getElementById("order-quantity").value;

    const info = { quantity, product_id, user_id };

    fetch("https://juicycart-tropicals.onrender.com/order/place/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(info)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                orderBtn.innerHTML = `Buy Now`;
                window.location.href = "./profile.html";
            } else {
                orderBtn.innerHTML = `Buy Now`;
                alert("Something went wrong with your order!");
            }
        })
        .catch(err => {
            console.error("Error placing order:", err);
            orderBtn.innerHTML = `Buy Now`;
            alert("Error placing order!");
        });
}

document.addEventListener("DOMContentLoaded", () => {
    const decreaseBtn = document.getElementById("decrease");
    const increaseBtn = document.getElementById("increase");
    const quantityInput = document.getElementById("order-quantity");

    decreaseBtn.addEventListener("click", () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener("click", () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });
});
