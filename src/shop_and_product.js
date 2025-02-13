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
            "bg-white",
            "rounded-lg",
            "overflow-hidden",
            "w-72",
            "h-96"
        );

        div.innerHTML = `
            <figure class="h-48 bg-gray-100 flex justify-center items-center">
                    <img src="${product.image}" alt="${product.name}" class="object-cover h-full w-full hover:scale-105 transition-transform duration-300">
            </figure>
            <div class="p-4 flex flex-col h-[calc(100%-12rem)]">
                <h2 class="text-md font-semibold text-gray-700 h-12 overflow-hidden">
                    ${product.name.slice(0, 40)}
                </h2>
                <div class="badge bg-green-500 p-2 gap-2 text-white">${product.available} in stock</div>
                <p class="text-green-600 font-bold text-xl my-3">$${product.price}</p>
                <div class="mt-auto">
                    <button onclick="window.location.href = 'single_product.html?product_id=' + ${product.id}" 
                            class="btn w-full bg-green-500 hover:bg-green-600 text-white rounded-lg transition">
                        Details
                    </button>
                </div>
            </div>

        `;
        productsSection.appendChild(div);
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
                    "hover:text-green-600",
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

document.getElementById("filterBtn").addEventListener("click", () => {
    currentPage = 1;
    applyFilters();
});

fetchProducts();
placeCategory();