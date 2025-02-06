const getValue = (id) => {
    const value = document.getElementById(id).value;
    return value;
};

const handleSellerRegister = (event) => {
    event.preventDefault();
    const username = getValue("username");
    const first_name = getValue("first-name");
    const last_name = getValue("last-name");
    const email = getValue("email");
    const mobile_no = getValue("mobile");
    const full_address = getValue("address");
    const password = getValue("password");
    info = { username, first_name, last_name, email, mobile_no, full_address, password };

    document.getElementById("error-message").innerText = "";
    document.getElementById("register-btn").innerHTML = `<span class="loading loading-spinner loading-xs"></span>`;
    document.getElementById("register-success").innerText = "";

    if (password.length >= 8) {
        fetch("https://juicycart-tropicals.onrender.com/user/register/seller/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(info),
        })
            .then(res => res.json())
            .then(data => {
                if (data.username) {
                    document.getElementById("error-message").innerText = data.username;
                } else if (data.Error) {
                    document.getElementById("error-message").innerText = data.Error;
                } else if (data.error) {
                    document.getElementById("error-message").innerText = data.error;
                } else if (data.success) {
                    document.getElementById("register-success").innerText = data.success;
                } else {
                    document.getElementById("error-message").innerText = "Something went wrong!";
                }
                document.getElementById("register-btn").innerHTML = `Register`;
            });
    } else {
        document.getElementById("error-message").innerText = "Password must be at least 8 character.";
        document.getElementById("register-btn").innerHTML = `Register`;
    }
};

const handleCustomerRegister = (event) => {
    event.preventDefault();
    const username = getValue("username");
    const first_name = getValue("first-name");
    const last_name = getValue("last-name");
    const email = getValue("email");
    const full_address = getValue("address");
    const password = getValue("password");
    info = { username, first_name, last_name, email, full_address, password };

    document.getElementById("error-message").innerText = "";
    document.getElementById("register-btn").innerHTML = `<span class="loading loading-spinner loading-xs"></span>`;
    document.getElementById("register-success").innerText = "";

    if (password.length >= 8) {
        fetch("https://juicycart-tropicals.onrender.com/user/register/customer/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(info),
        })
            .then(res => res.json())
            .then(data => {
                if (data.username) {
                    document.getElementById("error-message").innerText = data.username;
                } else if (data.Error) {
                    document.getElementById("error-message").innerText = data.Error;
                } else if (data.error) {
                    document.getElementById("error-message").innerText = data.error;
                } else if (data.success) {
                    document.getElementById("register-success").innerText = data.success;
                } else {
                    document.getElementById("error-message").innerText = "Something went wrong!";
                }
                document.getElementById("register-btn").innerHTML = `Register`;
            });
    } else {
        document.getElementById("error-message").innerText = "Password must be at least 8 character.";
        document.getElementById("register-btn").innerHTML = `Register`;
    }
};

const handleLogin = (event) => {
    event.preventDefault();

    const username = getValue("login-username");
    const password = getValue("login-password");
    const info = { username, password };
    document.getElementById("login-btn").innerHTML = `<span class="loading loading-spinner loading-xs"></span>`;
    fetch("https://juicycart-tropicals.onrender.com/user/login/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(info),
    })
        .then(res => res.json())
        .then(data => {
            if (data.token && data.user_id) {
                document.getElementById("login-error-message").innerText = "";
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id", data.user_id);
                window.location.href = "./profile.html";
            }
            else {
                document.getElementById("login-error-message").innerText = "Invalid username or password!";
            }
            document.getElementById("login-btn").innerHTML = `Login`;
        });
};

const profileView = () => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!token || !user_id) {
        window.location.href = "./login.html";
        return;
    }

    // Fetch and populate user information
    fetch(`https://juicycart-tropicals.onrender.com/user/list/?user_id=${user_id}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.length > 0) {
                const user = data[0];
                document.getElementById("profile-username").innerText = user.username;
                document.getElementById("profile-email").innerText = user.email;
                document.getElementById("user-fullname").innerText = `${user.first_name} ${user.last_name}`;
                document.getElementById("user-email").innerText = user.email;
            }
        });

    // Fetch and populate seller information
    fetch(`https://juicycart-tropicals.onrender.com/user/seller/list/?user_id=${user_id}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.length > 0) {
                const seller = data[0];
                document.getElementById("seller-info").classList.remove("hidden");
                document.getElementById("seller-shop").classList.remove("hidden");
                document.getElementById("seller-mobile").innerText = seller.mobile_no;
                document.getElementById("seller-address").innerText = seller.full_address;
                document.getElementById("customer-image").classList.add("hidden");
                document.getElementById("seller-image").classList.remove("hidden");
                document.getElementById("seller-image").src = seller.image;

                // Fetch and populate seller's shop information
                fetch(`https://juicycart-tropicals.onrender.com/shop/list/?user_id=${user_id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data[0]) {
                            shop = data[0];
                            document.getElementById("shop-img").src = shop.image;
                            document.getElementById("shop-name").innerText = shop.name;
                            document.getElementById("shop-location").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${shop.location}`;
                            document.getElementById("shop-hotline").innerHTML = `<i class="fa-solid fa-phone"></i> +${shop.hotline}`;
                            document.getElementById("shop-description").innerText = shop.description;

                        } else {
                            document.getElementById("seller-shop").classList.add("hidden");
                            document.getElementById("create-shop-btn").innerHTML = `
                            <button class="btn bg-green-500 text-white hover:bg-green-600" 
                            onclick="showCreateShopModal()">
                                <i class="fa-solid fa-plus"></i> Create Your Own Shop
                            </button>`
                        }
                    });
            }
        });

    // Fetch and populate customer information
    fetch(`https://juicycart-tropicals.onrender.com/user/customer/list/?user_id=${user_id}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.length > 0) {
                const customer = data[0];
                document.getElementById("customer-info").classList.remove("hidden");
                document.getElementById("customer-address").innerText = customer.full_address;
                document.getElementById("account-balance").innerText = `$${customer.balance}`;
                document.getElementById("seller-image").classList.add("hidden");
                document.getElementById("customer-image").classList.remove("hidden");
                document.getElementById("customer-image").src = customer.image;
            }
        });

    // Fetch and populate customer orders information
    fetch(`https://juicycart-tropicals.onrender.com/order/list/?customer_id=${user_id}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.length > 0) {
                document.getElementById("customer-orders").classList.remove("hidden");
                data.forEach((order) => {
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
            }
        });


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
                    document.getElementById("cancel-order-btn").innerHTML = `<button class="btn btn-sm bg-green-500 text-white hover:bg-green-600" onClick="cancelOrder(${order.id})">Cancel Order</button>`;
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
                window.location.href = "./profile.html";
            } else {
                alert("something went wrong!");
            }
        });
};

const showCreateShopModal = () => {
    document.getElementById("create_shop_modal").showModal();
};

const createShop = async () => {
    const shopName = document.getElementById("shop-name-input").value;
    const shopImage = document.getElementById("shop-image-input").files[0];
    const hotline = document.getElementById("hotline-input").value;
    const location = document.getElementById("location-input").value;
    const description = document.getElementById("description-input").value;
    const userId = localStorage.getItem("user_id");

    // Create FormData object
    const formData = new FormData();
    formData.append("owner", userId);
    formData.append("name", shopName);
    formData.append("image", shopImage);
    formData.append("hotline", hotline);
    formData.append("description", description);
    formData.append("location", location);
    
    try {
        const response = await fetch("https://juicycart-tropicals.onrender.com/shop/create/", {
            method: "POST",
            body: formData, 
        });

        if (response.ok) {
            const result = await response.json();
            window.location.href = "./profile.html"
        } else {
            const errorData = await response.json();
            alert("Failed to create shop. Check console for details.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("A network error occurred. Please try again later.");
    }
};

