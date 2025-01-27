const allCount = () => {
    // shop count 
    fetch("https://juicycart-tropicals.onrender.com/shop/list/")
    .then(res => res.json())
    .then(data => {
        document.getElementById("store-count").innerText = `${data.length}+ Store`
    });

    // category count
    fetch("https://juicycart-tropicals.onrender.com/listing/categories/")
    .then(res => res.json())
    .then(data => {
        document.getElementById("category-count").innerText = `${data.length}+ Category`
    });

    // product count
    fetch("https://juicycart-tropicals.onrender.com/listing/products/")
    .then(res => res.json())
    .then(data => {
        document.getElementById("product-count").innerText = `${data.count}+ Product`
    });

    // order count
    fetch("https://juicycart-tropicals.onrender.com/order/list/")
    .then(res => res.json())
    .then(data => {
        document.getElementById("order-count").innerText = `${data.length}+ Order`
    });
};

const loadCategory = () => {
    fetch("https://juicycart-tropicals.onrender.com/listing/categories/")
    .then(res => res.json())
    .then(data => displayCategory(data));
};

const displayCategory = (categories) => {
    categories.forEach(category => {
        parent = document.getElementById("categories");
        div = document.createElement("div");
        div.classList.add("shadow-lg");
        div.innerHTML = `
            <div class="text-center max-w-sm p-6 rounded-lg border border-t-orange-400">
                <h5 class="mb-2 text-5xl font-bold text-black">${category.name}</h5>
                <p class="mb-3 font-normal text-gray-800">Click here to explore all the mangoes on this category!</p>
                <a href="./listing/all_products.html" class="btn bg-orange-500 border-none hover:bg-orange-700  text-white">Explore <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
            </div>
        `
        parent.appendChild(div);
    });
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


allCount();
loadCategory();