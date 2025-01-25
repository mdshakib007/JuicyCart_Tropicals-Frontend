const placeShopInformation = () => {
    user_id = localStorage.getItem("user_id");
    fetch(`https://juicycart-tropicals.onrender.com/shop/list/?shop_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
            shop = data[0];
            if (shop) {
                document.getElementById("shop-img").src = shop.image;
                document.getElementById("shop-name").innerText = shop.name;
                document.getElementById("shop-location").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${shop.location}`;
                document.getElementById("shop-hotline").innerHTML = `<i class="fa-solid fa-phone"></i> +${shop.hotline}`;
                document.getElementById("shop-description").innerText = shop.description;
            } else {
                window.location.href = "profile.html";
            }
        })
};

const showAddProductModal = () => {
    document.getElementById("create_product_modal").showModal();
};

placeShopInformation();