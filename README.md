# E-commerce NestJS Backend

A robust, scalable, and feature-rich e-commerce backend built with [NestJS](https://nestjs.com/), MongoDB, and Stripe. This project is designed for real-world production use, supporting advanced authentication, authorization, payment, localization, and more.

---

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication (accessToken & refreshToken)
  - Role-based access control (Admin, User, etc.)
  - OAuth2 login (Google, Facebook, ...)
  - Password reset & update
- **Product Management**
  - CRUD for products, brands, categories, sub-categories, suppliers
  - Product images, price after discount, stock management
- **Cart & Order System**
  - Add/remove/update cart items
  - Place orders (cash or card)
  - Order status tracking (paid, delivered, etc.)
  - User order history
- **Payment Integration**
  - Stripe payment gateway (card payments)
  - Webhook for payment confirmation
- **Coupon & Discount System**
  - Create and apply coupons
  - Automatic price calculation with discounts
- **Tax & Shipping**
  - Dynamic tax and shipping calculation
- **Review & Rating System**
  - Users can review and rate products
- **Filtering, Sorting, Pagination**
  - Powerful query options for all resources
  - Filter by any field, sort, and paginate results
- **Localization (i18n)**
  - Multi-language support for API responses (e.g., English, Arabic)
- **Security**
  - Secure password hashing
  - Input validation (DTOs)
  - Guards for protected routes
- **API Documentation**
  - Swagger (OpenAPI) auto-generated docs
- **Extensible & Modular Architecture**
  - Clean code structure, easy to extend


---

## 🛠️ Technologies Used
- **NestJS** (TypeScript)
- **MongoDB** (Mongoose ODM)
- **Stripe** (Payments)
- **Swagger** (API Docs)
- **JWT** (Authentication)
- **Passport** (OAuth2)
- **nodeMailer**(send mails)

---

## 📂 Project Structure

```
E-commerce_NestJS/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── auth/           # Authentication & Authorization
│   ├── brand/          # Brand management
│   ├── cart/           # Shopping cart
│   ├── category/       # Product categories
│   ├── coupon/         # Coupons & discounts
│   ├── database/       # Database connection
│   ├── error/          # Error handling
│   ├── guard/          # Auth guards & decorators
│   ├── order/          # Orders & checkout
│   ├── product/        # Products
│   ├── request-product/# Product requests
│   ├── review/         # Product reviews
│   ├── sub-category/   # Sub-categories
│   ├── suppliers/      # Suppliers
│   ├── tax/            # Tax & shipping
│   └── user/           # User management
├── .env.example        # Environment variables sample
├── package.json
├── README.md
└── ...
```

---

## 📖 API Documentation

Interactive API docs available via Swagger:

- **URL:** `http://localhost:3000/api/docs`
- **Features:**
  - Try out endpoints directly
  - View request/response schemas
  - See authentication requirements

---

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/E-commerce_NestJS.git
cd E-commerce_NestJS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
- Copy `.env.example` to `.env` and fill in your values:

```
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
STRIPE_PRIVATE_KEY=your_stripe_key
OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
OAUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
# ... add more as needed
```

### 4. Run the app
```bash
npm run start:dev
```

### 5. Access Swagger Docs
- Open [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 🔥 Example API Requests

### Register User
```http
POST /auth/register
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login (Get Access & Refresh Token)
```http
POST /auth/login
Content-Type: application/json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json
{
  "refreshToken": "..."
}
```

### OAuth Login
```http
GET /auth/oauth/google
```

### Get Products (with filter, sort, pagination)
```http
GET /product?brand=Apple&minPrice=1000&sort=-price&page=2&limit=10
```

### Place Order (Card)
```http
POST /cart/checkout/card?success_url=...&cancel_url=...
Authorization: Bearer <accessToken>
Content-Type: application/json
{
  "shippingAddress": "..."
}
```

---

## 🌍 Localization (i18n)
- All API responses support multi-language (e.g., English, Arabic) via the `Accept-Language` header.
- Example:
  ```http
  GET /product
  Accept-Language: ar
  ```

---

## 🧑‍💻 Contribution Guidelines
1. Fork the repo and create your branch from `main`.
2. Add your feature or fix a bug.
3. Write tests for your code.
4. Ensure code style and linting pass.
5. Submit a pull request with a clear description.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact
- **Author:** Abdelrahman Mohamed Elsaeed
- **Email:** abdoelsaeed290@gmail.com
- **GitHub:** [abdoelsaeed](https://github.com/abdoelsaeed)

---

> **Note:** This project is a full-featured e-commerce backend, ready for production and extensible for any business needs. Feel free to use, contribute, or reach out for collaboration!
