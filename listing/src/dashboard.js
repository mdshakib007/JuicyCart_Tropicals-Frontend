const placeShopInformation = () => {
    user_id = localStorage.getItem("user_id");
    fetch(`https://juicycart-tropicals.onrender.com/shop/list/?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
            shop = data[0];
            if (shop) {
                document.getElementById("shop-img").src = shop.image;
                document.getElementById("shop-name").innerText = shop.name;
                document.getElementById("shop-location").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${shop.location}`;
                document.getElementById("shop-hotline").innerHTML = `<i class="fa-solid fa-phone"></i> +${shop.hotline}`;
                document.getElementById("shop-description").innerText = shop.description;
                fetchProducts(shop.id);
                fetchOrders(shop.id);
            } else {
                window.location.href = "../user/profile.html";
            }
        })
};

const showAddProductModal = () => {
    // Fetch all categories
    fetch("https://juicycart-tropicals.onrender.com/listing/categories/")
        .then(res => res.json())
        .then(data => {
            const div = document.getElementById("category-input-div");
            const child = document.createElement("select");
            child.id = "category-input";
            child.classList.add("select", "select-warning", "w-full");

            data.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                child.appendChild(option);
            });

            div.innerHTML = "";
            div.appendChild(child);
        })
        .catch(err => {
            console.error("Error fetching categories:", err);
        });

    document.getElementById("create_product_modal").showModal();
};

let currentPage = 1;

const fetchProducts = (shop_id) => {
    fetch(`https://juicycart-tropicals.onrender.com/listing/products/?shop_id=${shop_id}`)
        .then(res => res.json())
        .then(data => {
            if (data.results.length > 0) {
                displayProducts(data.results);
                updatePagination(data.previous, data.next);
            }
        })
        .catch(err => {
            console.error("Error fetching products:", err);
        });
};

const fetchOrders = (shop_id) => {
    fetch(`https://juicycart-tropicals.onrender.com/order/list/?shop_id=${shop_id}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                displayOrders(data);
            }
        })
        .catch(err => {
            console.error("Error fetching products:", err);
        });
};

const displayProducts = (products) => {
    const productsSection = document.getElementById("products");
    productsSection.innerHTML = "";

    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add(
            "card",
            "bg-white",
            "rounded-lg",
            "shadow-md",
            "overflow-hidden",
            "max-w-96"
        );

        div.innerHTML = `
            <div class="card max-w-sm border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <!-- Image Section -->
                <figure class="h-48 bg-gray-100 flex justify-center items-center">
                    <img src="${product.image}" alt="${product.name}" class="object-cover h-full w-full hover:scale-105 transition-transform duration-300">
                </figure>
                <!-- Content Section -->
                <div class="p-4">
                    <h2 class="text-lg font-semibold text-gray-800 line-clamp-1">${product.name}</h2>
                    <p class="text-sm text-gray-500 mt-2">Available Quantity: <span class="font-medium">${product.available}</span></p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-orange-600 font-bold text-lg mr-8">$${product.price}</span>
                        <div class="flex space-x-2">
                            <button onclick="showEditProductModal(${product.id})" class="btn btn-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center">
                                <i class="fa-solid fa-pen"></i> Edit
                            </button>
                            <button onclick="deleteProduct(${product.id})" class="btn btn-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center">
                                <i class="fa-solid fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        `;
        productsSection.appendChild(div);
    });
};

const displayOrders = (orders) => {
    orders.forEach(order => {
        const parent = document.getElementById("order-table");
        const tr = document.createElement("tr");
        tr.classList.add("hover");
        tr.innerHTML = `
            <th>${order.created_at.slice(0, 10)}</th>
            <td>X${order.quantity}</td>
            <td>$${order.total_price}</td>
            <td>${order.status}</td>
            <td>
                <button 
                    class="btn btn-sm bg-orange-500 text-white hover:bg-orange-600" 
                    onclick="showOrderDetails(${order.id})">
                    Details
                </button>
            </td>
        `;
        parent.appendChild(tr);
    });
};

const addProduct = async () => {
    const name = document.getElementById("product-name-input").value;
    const image = document.getElementById("product-image-input").files[0];
    const price = document.getElementById("price-input").value;
    const category = document.getElementById("category-input").value;
    const quantity = document.getElementById("quantity-input").value;
    const description = document.getElementById("description-input").value;
    const userId = localStorage.getItem("user_id");

    // Create FormData object
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);
    formData.append("category", category);
    formData.append("available", quantity);
    formData.append("about", description);

    try {
        const response = await fetch("https://juicycart-tropicals.onrender.com/listing/product/add/", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            window.location.href = "dashboard.html"
        } else {
            const errorData = await response.json();
            alert("Failed to add product.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("A network error occurred. Please try again later.");
    }
};

const deleteProduct = (product_id) => {
    user_id = localStorage.getItem("user_id");
    info = { user_id, product_id };
    fetch("https://juicycart-tropicals.onrender.com/listing/product/delete/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(info)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = "dashboard.html";
            } else {
                alert("Something went wrong while deleting product.");
            }
        });
};

const showEditProductModal = (product_id) => {
    const modal = document.getElementById("edit_product_modal");
    modal.setAttribute("data-product-id", product_id);
    modal.showModal();
};

const editProduct = () => {
    const modal = document.getElementById("edit_product_modal");
    const product_id = modal.getAttribute("data-product-id"); // Get product_id from modal
    const user_id = localStorage.getItem("user_id");
    const available = document.getElementById("product-quantity-edit").value;

    const info = { user_id, product_id, available };

    fetch("https://juicycart-tropicals.onrender.com/listing/product/edit/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
    }).then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "dashboard.html";
            } else {
                alert("something went wrong while updating the quantity.");
            }
        });
};

const updatePagination = (prev, next) => {
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");

    prevButton.disabled = !prev;
    nextButton.disabled = !next;

    prevButton.onclick = () => {
        if (prev) {
            currentPage--;
        }
    };
    nextButton.onclick = () => {
        if (next) {
            currentPage++;
        }
    };
};

const showOrderDetails = (order_id) => {
    fetch(`https://juicycart-tropicals.onrender.com/order/list/?order_id=${order_id}`)
        .then((res) => res.json())
        .then((orderData) => {
            if (orderData.length > 0) {
                const order = orderData[0];
                document.getElementById("modal-order-id").innerText = order.id;
                document.getElementById("modal-order-date").innerText = `${order.created_at.slice(0, 10)} at ${order.created_at.slice(11, 16)} (GMT+6)`;
                document.getElementById("modal-order-quantity").innerText = `X${order.quantity}`;
                document.getElementById("modal-order-total").innerText = `$${order.total_price}`;
                document.getElementById("modal-order-status").innerText = order.status;
                if (order.status === "Pending") {
                    document.getElementById("cancel-order-btn").innerHTML = `<button class="btn btn-sm bg-orange-500 text-white hover:bg-orange-600" onClick="cancelOrder(${order.id})">Cancel Order</button>`;
                }

                // Fetch product details using the product_id
                fetch(`https://juicycart-tropicals.onrender.com/listing/products/?product_id=${order.product}`)
                    .then((res) => res.json())
                    .then((productData) => {
                        if (productData.results.length > 0) {
                            const product = productData.results[0];
                            document.getElementById("modal-product-name").innerText = product.name;
                            document.getElementById("modal-product-about").innerText = `${product.about.slice(0, 60)}...`;
                            document.getElementById("modal-product-image").src = product.image;
                            document.getElementById("modal-product-price").innerText = `$${product.price}`;
                        }
                    })
                    .catch((err) => console.error("Error fetching product details:", err));

                document.getElementById("order_details_modal").showModal();
            }
        })
        .catch((err) => console.error("Error fetching order details:", err));
};

const cancelOrder = (order_id) => {
    user_id = localStorage.getItem("user_id");
    info = { user_id, order_id }
    fetch("https://juicycart-tropicals.onrender.com/order/cancel/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(info),
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = "profile.html";
            } else {
                alert("something went wrong!");
            }
        });
};

placeShopInformation();