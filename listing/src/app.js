let currentPage = 1;

const showSkeleton = () => {
    const skeleton = document.getElementById("skeleton-lazy");
    const productsSection = document.getElementById("products");
    const notFound = document.getElementById("not-found");

    productsSection.innerHTML = ""; // Clear any existing content
    notFound.style.display = "none"; // Hide "Not Found" message
    skeleton.style.display = "flex"; // Show skeleton loading
};

const showNotFound = () => {
    const skeleton = document.getElementById("skeleton-lazy");
    const notFound = document.getElementById("not-found");

    skeleton.style.display = "none"; // Hide skeleton
    notFound.style.display = "block"; // Show "Not Found" message
};

const fetchProducts = (params = {}) => {
    const url = new URL("https://juicycart-tropicals.onrender.com/listing/products/");
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    showSkeleton(); // Show skeleton before fetching

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.results.length > 0) {
                displayProducts(data.results);
                updatePagination(data.previous, data.next);
            } else {
                showNotFound(); // Show "Not Found" if no products are returned
            }
        })
        .catch(err => {
            console.error("Error fetching products:", err);
            showNotFound(); // Handle errors by showing "Not Found"
        });
};

const displayProducts = (products) => {
    const skeleton = document.getElementById("skeleton-lazy");
    const productsSection = document.getElementById("products");
    const notFound = document.getElementById("not-found");

    skeleton.style.display = "none"; // Hide skeleton loading
    notFound.style.display = "none"; // Hide "Not Found" message
    productsSection.innerHTML = ""; // Clear any previous products

    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add(
            "card",
            "bg-white",
            "rounded-lg",
            "shadow-md",
            "overflow-hidden",
        );

        div.innerHTML = `
            <figure class="h-48 bg-gray-100 flex justify-center items-center">
                    <img src="${product.image}" alt="${product.name}" class="object-cover h-full w-full hover:scale-105 transition-transform duration-300">
            </figure>
            <div class="p-4">
                <h2 class="text-lg font-semibold text-gray-800">${product.name} <div class="badge bg-orange-500 p-3 gap-2 text-white">${product.available} in stock</h2>
                <p class="text-sm text-gray-500">${product.about.slice(0, 60)}...</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-orange-600 font-bold text-xl">$${product.price}</span>
                    <button onclick="buyProductModal(${product.id})" class="btn bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition">
                        Details
                    </button>
                </div>
            </div>
        `;
        productsSection.appendChild(div);
    });
};

const buyProductModal = (product_id) => {
    document.getElementById("buy_now_modal").showModal();
    user_id = localStorage.getItem("user_id");
    document.getElementById("buy_now_modal").setAttribute("product_id", product_id);

    fetch(`https://juicycart-tropicals.onrender.com/listing/products/?product_id=${product_id}`)
    .then(res => res.json())
    .then(data => {
        if(data.results.length > 0){
            product = data.results[0];
            document.getElementById("modal-product-image").src = product.image;
            document.getElementById("modal-product-name").innerText = product.name;
            document.getElementById("modal-product-price").innerHTML = `$${product.price}`;
            document.getElementById("modal-product-quantity").innerText = product.available;
            document.getElementById("modal-product-sold").innerText = product.sold;
            document.getElementById("modal-product-about").innerText = product.about;

            // fetch and place category
            fetch(`https://juicycart-tropicals.onrender.com/listing/categories/?category_id=${product.category}`)
            .then(res => res.json())
            .then(category => {
                if(category.length > 0){
                    document.getElementById("modal-product-category").innerText = category[0].name;
                }
            });
            // fetch and place shop
            fetch(`https://juicycart-tropicals.onrender.com/shop/list/?shop_id=${product.shop}`)
            .then(res => res.json())
            .then(shop => {
                if(shop.length > 0){
                    document.getElementById("modal-product-shop").innerHTML = `<span class="cursor-pointer" onclick="customerShopView(${shop[0].id})">${shop[0].name}</span>`;
                }
            });
            // fetch and place the location of the customer
            fetch(`https://juicycart-tropicals.onrender.com/user/customer/list/?user_id=${user_id}`)
            .then(res => res.json())
            .then(customer => {
                if(customer.length > 0){
                    document.getElementById("modal-place-location").innerHTML = `<i class="fa-solid fa-location-dot"></i> Delevery Address: ${customer[0].full_address}`;
                }
            });

            if(product.available < 1){
                document.getElementById("modal-buy-now-btn").classList.add("hidden");
                document.getElementById("modal-product-unavailable").classList.remove("hidden");

            } else{
                document.getElementById("modal-buy-now-btn").classList.remove("hidden");
                document.getElementById("modal-product-unavailable").classList.add("hidden");
            }
        } else{
            alert("Something went wrong.");
        }
    })
};

const buyProduct = (event) => {
    event.preventDefault();
    document.getElementById("order-now-modal-btn").innerHTML = `<span class="loading loading-spinner loading-xs"></span>`; // loading spinner
    const quantity = document.getElementById("modal-quantity-input").value;
    const user_id = localStorage.getItem("user_id");
    const product_id = document.getElementById("buy_now_modal").getAttribute("product_id");
    const info = {quantity, product_id, user_id};

    fetch("https://juicycart-tropicals.onrender.com/order/place/", {
        method : "POST",
        headers : {"content-type" : "application/json"},
        body : JSON.stringify(info)
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            document.getElementById("order-now-modal-btn").innerHTML = `Order Now`; // loading spinner
            window.location.href = "../user/profile.html";
        }else{
            document.getElementById("order-now-modal-btn").innerHTML = `Order Now`; // loading spinner
            alert("something went wrong!");
        }
    })
};

const customerShopView = (shop_id) => {
    window.location.href='shop.html';
    
    fetch(`https://juicycart-tropicals.onrender.com/shop/list/?shop_id=${shop_id}`)
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
}

const updatePagination = (prev, next) => {
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");

    prevButton.disabled = !prev;
    nextButton.disabled = !next;

    prevButton.onclick = () => {
        if (prev) {
            currentPage--;
            applyFilters();
        }
    };
    nextButton.onclick = () => {
        if (next) {
            currentPage++;
            applyFilters();
        }
    };
};

const placeCategory = () => {
    fetch("https://juicycart-tropicals.onrender.com/listing/categories/")
        .then(res => res.json())
        .then(data => {
            const parent = document.getElementById("categories");

            data.forEach(category => {
                const div = document.createElement("div");
                div.classList.add(
                    "badge",
                    "badge-outline",
                    "m-2",
                    "p-3",
                    "rounded-lg",
                    "border",
                    "border-gray-300",
                    "hover:bg-gray-100",
                    "hover:text-orange-600",
                    "transition-all",
                    "duration-300",
                    "cursor-pointer"
                );
                div.innerHTML = `<span class="text-sm font-medium">${category.name}</span>`;
                
                div.addEventListener("click", () => {
                    currentPage = 1; // Reset to the first page for new filter
                    applyFilters({ category_id: category.id });
                });

                parent.appendChild(div);
            });
        })
        .catch(err => console.error("Error fetching categories:", err));
};

const applyFilters = (extraParams = {}) => {
    const searchKeyword = document.getElementById("searchKeyword").value;
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;

    const params = { page: currentPage };
    if (searchKeyword) params.name = searchKeyword;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;

    // Merge additional parameters like category_id
    Object.assign(params, extraParams);

    fetchProducts(params);
};


const handleLogout = (event) => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!token || !user_id) {
        window.location.href = "login.html"
        return;
    };

    const info = { token, user_id };
    fetch("https://juicycart-tropicals.onrender.com/user/logout/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(info),
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                window.location.href = "login.html";
            } else {
                console.error("Logout failed:", data);
                alert("Logout failed. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error during logout:", error);
        });
};


document.getElementById("filterBtn").addEventListener("click", () => {
    currentPage = 1;
    applyFilters();
});

fetchProducts();
placeCategory();