const isSeller = () => {
    user_id = localStorage.getItem("user_id");
    token = localStorage.getItem("token");

    if (!user_id || !token) {
        window.location.href = "./login.html";
    }

    fetch(`https://juicy-cart-tropicals-backend.vercel.app/user/seller/list/?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
            if (data.length < 1) {
                window.location.href = "./profile.html";
            }
        })
};

document.addEventListener("DOMContentLoaded", function () {
    const toggleSections = ["shop-analytics", "customer-orders", "my-products-section"];

    const urlParams = new URLSearchParams(window.location.search);
    let activeTab = urlParams.get("tab") || "shop-analytics";

    toggleSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = "none";
        }
    });

    if (toggleSections.includes(activeTab) && document.getElementById(activeTab)) {
        document.getElementById(activeTab).style.display = "block";
    } else {
        document.getElementById("shop-analytics").style.display = "block";
    }
});


const placeShopInformation = () => {
    user_id = localStorage.getItem("user_id");
    fetch(`https://juicy-cart-tropicals-backend.vercel.app/shop/list/?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
            shop = data[0];
            if (shop) {
                document.getElementById("shop-img").src = shop.image;
                document.getElementById("shop-img-2").src = shop.image;
                document.getElementById("shop-name").innerText = shop.name;
                document.getElementById("shop-location").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${shop.location}`;
                document.getElementById("shop-hotline").innerHTML = `<i class="fa-solid fa-phone"></i> +${shop.hotline}`;
                document.getElementById("shop-description").innerText = shop.description;
                fetchProducts(shop.id);
                fetchOrders(shop.id);
            } else {
                window.location.href = "./profile.html";
            }
        })

    // load and populate shop dashboard
    fetch("http://127.0.0.1:8000/shop/dashboard/",{
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({"user_id" : localStorage.getItem("user_id")})
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("sold-count").innerHTML = `${data.total_orders}`;
        document.getElementById("pending-count").innerHTML = `${data.total_pending}`;
        document.getElementById("engagement-score").innerHTML = `${data.engagement_score}`;
        document.getElementById("review-count").innerHTML = `${data.reviews}`;
        document.getElementById("stock-count").innerHTML = `${data.total_sold}`;
        document.getElementById("cancel-count").innerHTML = `${data.total_cancelled}`;
        document.getElementById("my-products").innerHTML = `${data.product_count}`;
        document.getElementById("total-earning").innerHTML = `$${data.total_earning}`;
        document.getElementById("available-stock").innerHTML = `${data.available_stock}`;
    });
};



const showAddProductModal = () => {
    // Fetch all categories
    fetch("https://juicy-cart-tropicals-backend.vercel.app/listing/categories/")
        .then(res => res.json())
        .then(data => {
            const div = document.getElementById("category-input-div");
            const child = document.createElement("select");
            child.id = "category-input";
            child.classList.add("select", "select-success", "w-full");

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
    fetch(`https://juicy-cart-tropicals-backend.vercel.app/listing/products/?shop_id=${shop_id}`)
        .then(res => res.json())
        .then(data => {
            if (data.results.length > 0) {
                displayProducts(data.results);
            }
        })
        .catch(err => {
            console.error("Error fetching products:", err);
        });
};

const fetchOrders = (shop_id) => {
    fetch(`https://juicy-cart-tropicals-backend.vercel.app/order/list/?shop_id=${shop_id}`)
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
    products.forEach(product => {
        const parent = document.getElementById("product-table");
        const tr = document.createElement("tr");
        tr.classList.add("hover");
        tr.innerHTML = `
            <td><img src="${product.image}" class="max-h-16" /></td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>${product.available}</td>
            <td>${product.sold}</td>
            <td>
                <button onclick="showEditProductModal(${product.id})" 
                    class="btn btn-sm bg-green-500 text-white hover:bg-green-600" 
                    >
                    <i class="fa-solid fa-pencil"></i> Edit
                </button>
            </td>
            <td>
                <button onclick="deleteProduct(${product.id})" 
                    class="btn btn-sm bg-red-500 text-white hover:bg-red-600" 
                    >
                    <i class="fa-solid fa-trash-can"></i> Delete
                </button>
            </td>
        `;
        parent.appendChild(tr);
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
                    class="btn btn-sm bg-green-500 text-white hover:bg-green-600" 
                    onclick="showOrderDetails(${order.id})">
                    Details
                </button>
            </td>
        `;
        parent.appendChild(tr);
    });
};

const addProduct = async () => {
    document.getElementById("add-product-btn").innerHTML = `<span class="loading loading-spinner loading-xs"></span>`; // loading spinner
    const name = document.getElementById("product-name-input").value;
    const image = document.getElementById("product-image-input").files[0];
    const price = document.getElementById("price-input").value;
    const category = document.getElementById("category-input").value;
    const quantity = document.getElementById("quantity-input").value;
    const description = document.getElementById("description-input").value;
    const userId = localStorage.getItem("user_id");


    if (!name || !image || !price || !category || !quantity || !description) {
        document.getElementById("add-product-btn").innerHTML = `Add Product`;
        Toastify({
            text: `Please fill all fields.`,
            duration: 3000,
            offset: {
                x: 10,
                y: 50
            },
            style: {
                background: "#22c55e",
            }
        }).showToast();
        return;
    }

    const imageForm = new FormData();
    imageForm.append("image", image);
    let img_url = "";
    try {
        const imgResponse = await fetch("https://api.imgbb.com/1/upload?key=a1628c9dacce3ab8a8de3488c32afc47", {
            method: "POST",
            body: imageForm,
        });

        const imgData = await imgResponse.json();

        if (imgData.success) {
            img_url = imgData.data.display_url;
        } else {
            Toastify({
                text: `Image upload failed.`,
                duration: 3000,
                offset: { x: 10, y: 50 },
                style: { background: "#22c55e" }
            }).showToast();
            document.getElementById("add-product-btn").innerHTML = `Add Product`;
            return;
        }
    } catch (error) {
        console.error("Image upload error:", error);
        Toastify({
            text: `Failed to upload image.`,
            duration: 3000,
            offset: { x: 10, y: 50 },
            style: { background: "#22c55e" }
        }).showToast();
        document.getElementById("add-product-btn").innerHTML = `Add Product`;
        return;
    }

    try {
        const response = await fetch("https://juicy-cart-tropicals-backend.vercel.app/listing/product/add/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "user_id": userId, "name": name, "price": price, "image": img_url, "category": category, "available": quantity, "about": description
            })
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById("add-product-btn").innerHTML = `Add Product`; // loading spinner
            window.location.href = "./dashboard.html"
        } else {
            const errorData = await response.json();
            document.getElementById("add-product-btn").innerHTML = `Add Product`; // loading spinner
            Toastify({
                text: `Failed to add product`,
                duration: 3000,
                offset: {
                    x: 10,
                    y: 50
                },
                style: {
                    background: "#22c55e",
                }
            }).showToast();
        }
    } catch (error) {
        console.error("Network error:", error);
        Toastify({
            text: `A network error occurred. Please try again later`,
            duration: 3000,
            offset: {
                x: 10,
                y: 50
            },
            style: {
                background: "#22c55e",
            }
        }).showToast();
        document.getElementById("add-product-btn").innerHTML = `Add Product`;
    }
};

const deleteProduct = (product_id) => {
    user_id = localStorage.getItem("user_id");
    info = { user_id, product_id };
    fetch("https://juicy-cart-tropicals-backend.vercel.app/listing/product/delete/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(info)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = "./dashboard.html";
            } else {
                Toastify({
                    text: `Something went wrong while deleting product`,
                    duration: 3000,
                    offset: {
                        x: 10,
                        y: 50
                    },
                    style: {
                        background: "#22c55e",
                    }
                }).showToast();
            }
        });
};

const showEditProductModal = (product_id) => {
    const modal = document.getElementById("edit_product_modal");
    modal.setAttribute("data-product-id", product_id);
    modal.showModal();
};

const editProduct = () => {
    document.getElementById("edit-product-btn").innerHTML = `<span class="loading loading-spinner loading-xs"></span>`; // loading spinner
    const modal = document.getElementById("edit_product_modal");
    const product_id = modal.getAttribute("data-product-id"); // Get product_id from modal
    const user_id = localStorage.getItem("user_id");
    const available = document.getElementById("product-quantity-edit").value;

    const info = { user_id, product_id, available };

    fetch("https://juicy-cart-tropicals-backend.vercel.app/listing/product/edit/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
    }).then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("edit-product-btn").innerHTML = `Update`; // loading spinner
                window.location.href = "./dashboard.html";
            } else {
                document.getElementById("edit-product-btn").innerHTML = `Update`; // loading spinner
                Toastify({
                    text: `something went wrong while updating the quantity`,
                    duration: 3000,
                    offset: {
                        x: 10,
                        y: 50
                    },
                    style: {
                        background: "#22c55e",
                    }
                }).showToast();
            }
        });
};


const showOrderDetails = (order_id) => {
    fetch(`https://juicy-cart-tropicals-backend.vercel.app/order/list/?order_id=${order_id}`)
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
                    document.getElementById("cancel-order-btn").innerHTML = `
                    <button id="admin-complete-order-btn" class="btn btn-sm bg-green-500 text-white hover:bg-green-600" onClick="completeOrder(${order.id})">Complete Order</button>
                    <button id="admin-cancel-order-btn" class="btn btn-sm bg-red-700 text-white hover:bg-red-800" onClick="cancelOrder(${order.id})">Cancel Order</button>
                    `;
                }

                // Fetch product details using the product_id
                fetch(`https://juicy-cart-tropicals-backend.vercel.app/listing/products/?product_id=${order.product}`)
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
    document.getElementById("admin-cancel-order-btn").innerHTML = `<span class="loading loading-spinner loading-xs"></span>`; // loading spinner
    fetch(`https://juicy-cart-tropicals-backend.vercel.app/order/list/?order_id=${order_id}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                order = data[0];
                const user_id = localStorage.getItem("user_id");
                const customer_id = order.customer;
                const order_status = "Cancelled";
                const info = { user_id, customer_id, order_id, order_status };

                fetch("https://juicy-cart-tropicals-backend.vercel.app/order/change/", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(info),
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            document.getElementById("admin-cancel-order-btn").innerHTML = `Cancel Order`; // loading spinner
                            window.location.href = "./dashboard.html";
                        } else {
                            document.getElementById("admin-cancel-order-btn").innerHTML = `Cancel Order`; // loading spinner
                            Toastify({
                                text: `An error occurred`,
                                duration: 3000,
                                offset: {
                                    x: 10,
                                    y: 50
                                },
                                style: {
                                    background: "#22c55e",
                                }
                            }).showToast();
                        }
                    })
            }
        });
};

const completeOrder = (order_id) => {
    document.getElementById("admin-complete-order-btn").innerHTML = `<span class="loading loading-spinner loading-xs"></span>`; // loading spinner
    fetch(`https://juicy-cart-tropicals-backend.vercel.app/order/list/?order_id=${order_id}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                order = data[0];
                const user_id = localStorage.getItem("user_id");
                const customer_id = order.customer;
                const order_status = "Completed";
                const info = { user_id, customer_id, order_id, order_status };

                fetch("https://juicy-cart-tropicals-backend.vercel.app/order/change/", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(info),
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            document.getElementById("admin-complete-order-btn").innerHTML = `Complete Order`; // loading spinner
                            window.location.href = "./dashboard.html";
                        } else {
                            document.getElementById("admin-complete-order-btn").innerHTML = `Complete Order`; // loading spinner
                            Toastify({
                                text: `An error occurred`,
                                duration: 3000,
                                offset: {
                                    x: 10,
                                    y: 50
                                },
                                style: {
                                    background: "#22c55e",
                                }
                            }).showToast();
                        }
                    })
            }
        });
};


isSeller();
placeShopInformation();