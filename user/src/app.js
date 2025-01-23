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
                } else if(data.length == 1){
                    document.getElementById("error-message").innerText = data.error;
                } else {
                    console.log(data);
                    document.getElementById("register-success").innerText = "Please Check Your Email For Confirmation!"
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
    fetch("https://smartcarebd-backend.onrender.com/patient/login/", {
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
                window.location.href = "index.html";
            }
            else {
                document.getElementById("login-error-message").innerText = "Wrong username or password provided!";
            }
            document.getElementById("login-btn").innerHTML = `Login`;
        });
};
