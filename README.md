# 🥭 JuicyCart-Tropicals - A Mango Marketplace  

🚀 **JuicyCart-Tropicals** is an API-based mango marketplace where sellers can list mangoes, manage orders, and customers can browse, filter, and track their purchases.  

📌 **Live Demo**: [JuicyCart-Tropicals Frontend (Demo)](https://mdshakib007.github.io/JuicyCart_Tropicals-Frontend/index.html)  

---

## 🔥 Key Features  

### 🔐 Authentication & User Management  
- **Token-based authentication** for secure API access.  
- **Email verification required** to activate accounts.  

### 🛍️ Seller Features  
- **Dedicated Seller Dashboard** – Manage a single shop.  
- **Add, edit, and delete products**.  
- **Update order status & send email notifications**.  

### 📦 Order Management  
- Customers can **place orders** & **cancel pending orders**.  
- Sellers can **update order status**.  
- **Email notifications** for order updates.  

### 💳 Payment Integration  
- **SSLCommerz** is used for secure online purchases.  

### 🔎 Product Filtering & Search  
- Search by **name, category, and price range**.  

### 🔐 Security  
- Used **Token Authentication**, but still exploring better security practices.  

---

## 📜 API Documentation  

### 1️⃣ **User**  
- **User List**: [`/user/list/`](https://juicycart-tropicals.onrender.com/user/list/)  
- **Seller List**: [`/user/seller/list/`](https://juicycart-tropicals.onrender.com/user/seller/list/)  
- **Customer List**: [`/user/customer/list/`](https://juicycart-tropicals.onrender.com/user/customer/list/)  
- **Filtering**:  
  - By User ID: [`/user/list/?user_id=2`](https://juicycart-tropicals.onrender.com/user/list/?user_id=2)  
  - By Seller ID: [`/user/seller/list/?user_id=3`](https://juicycart-tropicals.onrender.com/user/seller/list/?user_id=3)  
  - By Customer ID: [`/user/customer/list/?user_id=3`](https://juicycart-tropicals.onrender.com/user/customer/list/?user_id=3)  

### 2️⃣ **Authentication**  
- **Seller Registration**: [`/user/register/seller/`](https://juicycart-tropicals.onrender.com/user/register/seller/)  
  - **POST**: `username`, `first_name`, `last_name`, `email`, `mobile_no`, `full_address`, `password`  
- **Customer Registration**: [`/user/register/customer/`](https://juicycart-tropicals.onrender.com/user/register/customer/)  
  - **POST**: `username`, `first_name`, `last_name`, `email`, `full_address`, `password`  
- **Login**: [`/user/login/`](https://juicycart-tropicals.onrender.com/user/login/)  
  - **POST**: `username`, `password`  
- **Logout**: [`/user/logout/`](https://juicycart-tropicals.onrender.com/user/logout/)  
  - **POST**: `token`, `user_id`  

### 3️⃣ **Shop**  
- **Shop List**: [`/shop/list/`](https://juicycart-tropicals.onrender.com/shop/list/)  
- **Filtering**:  
  - By Shop ID: [`/shop/list/?shop_id=1`](https://juicycart-tropicals.onrender.com/shop/list/?shop_id=1)  
  - By Owner ID: [`/shop/list/?user_id=4`](https://juicycart-tropicals.onrender.com/shop/list/?user_id=4)  
- **Create Shop**: [`/shop/create/`](https://juicycart-tropicals.onrender.com/shop/create/)  
  - **POST**: `owner`, `name`, `image`, `hotline`, `description`, `location`  

### 4️⃣ **Product Listing**  
- **Categories**: [`/listing/categories/`](https://juicycart-tropicals.onrender.com/listing/categories/)  
- **Products**: [`/listing/products/`](https://juicycart-tropicals.onrender.com/listing/products/)  
- **Filtering**:  
  - By Category ID: [`/listing/categories/?category_id=3`](https://juicycart-tropicals.onrender.com/listing/categories/?category_id=3)  
  - By Shop ID: [`/listing/products/?shop_id=1`](https://juicycart-tropicals.onrender.com/listing/products/?shop_id=1)  
  - By Product Name: [`/listing/products/?name=string`](https://juicycart-tropicals.onrender.com/listing/products/?name=string)  
  - By Price Range:  
    - Min: [`/listing/products/?min_price=100`](https://juicycart-tropicals.onrender.com/listing/products/?min_price=100)  
    - Max: [`/listing/products/?max_price=200`](https://juicycart-tropicals.onrender.com/listing/products/?max_price=200)  
- **Add Product**: [`/listing/product/add/`](https://juicycart-tropicals.onrender.com/listing/product/add/)  
  - **POST**: `name`, `price`, `image`, `category`, `available`, `about`  
- **Edit Product**: [`/listing/product/edit/`](https://juicycart-tropicals.onrender.com/listing/product/edit/)  
  - **POST**:  
    - Required: `user_id`, `product_id`  
    - Optional: Other product data  
- **Delete Product**: [`/listing/product/delete/`](https://juicycart-tropicals.onrender.com/listing/product/delete/)  
  - **POST**: `user_id`, `product_id`  

### 5️⃣ **Order Management**  
- **Order List**: [`/order/list/`](https://juicycart-tropicals.onrender.com/order/list/)  
- **Filtering**:  
  - By Order ID: [`/order/list/?order_id=4`](https://juicycart-tropicals.onrender.com/order/list/?order_id=4)  
  - By Customer ID: [`/order/list/?customer_id=2`](https://juicycart-tropicals.onrender.com/order/list/?customer_id=2)  
  - By Shop ID: [`/order/list/?shop_id=2`](https://juicycart-tropicals.onrender.com/order/list/?shop_id=2)  
- **Place Order**: [`/order/place/`](https://juicycart-tropicals.onrender.com/order/place/)  
  - **POST**: `product_id`, `user_id`, `order_id`  
- **Cancel Order**: [`/order/cancel/`](https://juicycart-tropicals.onrender.com/order/cancel/)  
  - **POST**: `user_id`, `order_id`  
- **Change Order Status**: [`/order/change/`](https://juicycart-tropicals.onrender.com/order/change/)  
  - **POST**: `user_id`, `customer_id`, `order_id`, `order_status`  

---

## 💡 Future Enhancements  
✅ **React.js frontend** for a better user experience.  
✅ **Improve API security** with JWT & permissions.  
✅ **Advanced analytics for sellers**.  

---

## 🎯 Connect with Me  
📧 **Email**: shakib.ahmed.dev@gmail.com  
🔗 **LinkedIn**: [MD Shakib Ahmed](https://www.linkedin.com/in/mdshakib00777)  
📺 **YouTube**: [AlgoAspire](https://youtube.com/@algoaspire/)
