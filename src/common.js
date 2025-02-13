const loadComponent = async (url, elementId, callback = null) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;

        if (callback) callback();
    } catch (error) {
        console.error(`Error loading component:`, error);
    }
};

const handleLogout = () => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!token || !user_id) {
        window.location.href = "./login.html";
        return;
    }

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
                window.location.href = "./login.html";
            } else {
                Toastify({
                    text: `Session expired, please login again`,
                    duration: 3000,
                    offset: {
                        x: 10,
                        y: 50
                    },
                    style: {
                        background: "#22c55e",
                    }
                }).showToast();
                window.location.href = "login.html";
            }
        })
        .catch(error => {
            Toastify({
                text: `Session expired, please login again`,
                duration: 3000,
                offset: {
                    x: 10,
                    y: 50
                },
                style: {
                    background: "#22c55e",
                }
            }).showToast();
            window.location.href = "login.html";
            console.error("Error during logout:", error);
        });
};

const showHideNavLink = () => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    const login1 = document.getElementById("login-register-navigation");
    const login2 = document.getElementById("mobile-login-register-navigation");
    const profile1 = document.getElementById("profile-navigation");
    const profile2 = document.getElementById("mobile-profile-navigation");
    const logout1 = document.getElementById("logout-navigation");
    const logout2 = document.getElementById("mobile-logout-navigation");

    if (!token || !user_id) {
        login1.classList.remove("hidden");
        login2.classList.remove("hidden");
    } else {
        profile1.classList.remove("hidden");
        profile2.classList.remove("hidden");
        logout1.classList.remove("hidden");
        logout2.classList.remove("hidden");
    }
};

loadComponent('navbar.html', 'nav-component', showHideNavLink);
loadComponent('footer.html', 'footer-component');