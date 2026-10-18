# 🏠 RentNext — Rental Management API

> A backend API for a rental property platform, built with Node.js, Express.js, TypeScript, PostgreSQL, and Prisma ORM.

## 📖 About The Project

**RentNext** is a backend application designed to support rental property management workflows, user authentication, payment processing, and related platform operations.

Built with a modular TypeScript and Express.js architecture, RentNext provides the foundation for connecting a rental management frontend with backend services and a PostgreSQL database.

## ✨ Key Features

- 🔐 **Authentication & Authorization** — Secure authentication using JWT and password hashing.
- 🏘️ **Rental Management** — Backend support for rental platform workflows.
- 💳 **Payment Integration** — Stripe integration for payment-related operations.
- 🗄️ **Database Management** — PostgreSQL with Prisma ORM.
- 🍪 **Cookie Management** — Cookie-based request and session handling.
- 🌐 **REST API** — HTTP endpoints for frontend and client integration.

> Feature availability and access permissions depend on the implemented API endpoints.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript Runtime |
| Express.js | Backend Framework |
| TypeScript | Type Safety |
| PostgreSQL | Relational Database |
| Prisma ORM | Database Access |
| JWT | Token-Based Authentication |
| bcryptjs | Password Hashing |
| Stripe | Payment Processing |
| Cookie Parser | Cookie Handling |
| CORS | Cross-Origin Request Configuration |
| tsup | Production Build Tool |
| tsx | Development Server |

## 🔌 API Documentation

Explore the API endpoints, request parameters, and response examples through the published Postman documentation.

### 👉 [View RentNext API Documentation](https://documenter.getpostman.com/view/54702085/2sBY4LQMXp)

Use the documentation to understand the available endpoints and test supported API workflows.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL database
- Stripe credentials for payment functionality

### 1. Clone the Repository

```bash
git clone https://github.com/sifat-arch/RentNext.git
cd RentNext
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and configure the environment variables required by your application.

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="your_postgresql_connection_string"

JWT_SECRET="your_jwt_secret"

STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
```

> **Important:** These are example variable names. Check your source code for the exact environment variable names and any additional required configuration. Never commit real secrets to GitHub.

### 4. Run in Development

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

### 6. Start the Production Server

```bash
npm start
```

## 🧪 Stripe Webhook Testing

The project includes a Stripe CLI script for forwarding webhook events to the local payment endpoint.

```bash
npm run stripe:webhook
```

Ensure the Stripe CLI is installed and authenticated before running this command.

## 📁 Project Structure

```text
RentNext/
├── prisma/
├── src/
│   └── server.ts
├── package.json
├── prisma.config.ts
├── tsconfig.json
├── tsup.config.ts
└── vercel.json
```

This is a high-level overview. Refer to the repository for the complete application structure.

## 🔒 Security

- Store secrets in environment variables.
- Hash passwords before storing them.
- Validate authentication tokens on protected routes.
- Configure CORS for trusted frontend origins.
- Verify Stripe webhook signatures before processing payment events.
- Validate and authorize sensitive operations on the server.

## 👨‍💻 Author

**Sifat Ullah** — Full Stack Web Developer

- **GitHub:** [@sifat-arch](https://github.com/sifat-arch)
- **Email:** [sifatullah1004@gmail.com](mailto:sifatullah1004@gmail.com)
- **Portfolio:** [Visit Portfolio](https://cute-lokum-f5a354.netlify.app/)

---

Built with ❤️ using Node.js, Express.js, TypeScript, PostgreSQL, and Prisma ORM.
