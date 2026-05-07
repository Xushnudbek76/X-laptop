# X-laptop

Full-stack e-commerce platform for buying and managing laptops, built with the MERN stack and TypeScript. Features a public API for customers and a server-rendered admin dashboard for shop management.

## Features

### Customer-Facing

- **Product catalog** — Browse laptops with filtering by brand, category, RAM, and storage
- **Search** — Keyword search across product names
- **Product detail** — View full product info with images
- **User authentication** — Signup, login, logout via session-based auth
- **Profile management** — Update profile image and details
- **Order management** — Create orders, view order history, update order status
- **Like system** — Like/favorite products
- **Reviews & ratings** — Leave and view product reviews
- **Top users** — View top-rated community members

### Admin Dashboard (SSR)

- **Shop authentication** — Separate admin signup/login with session management
- **Product management** — Create new products with multi-image upload (up to 5), view all products, update product status
- **User management** — View all registered users, update user statuses
- **Home overview** — Dashboard landing page

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Language** | TypeScript |
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose ORM |
| **Session Store** | MongoDB (connect-mongodb-session) |
| **Template Engine** | EJS (admin dashboard) |
| **File Upload** | Multer |
| **Auth** | JWT + express-session + bcryptjs |
| **HTTP Logging** | Morgan |
| **CORS** | cors middleware |
| **Testing** | Jest + Supertest |

## Project Structure

```
X-laptop/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── item.controller.ts    # Product CRUD
│   │   ├── member.controller.ts  # User auth & profile
│   │   ├── order.controller.ts   # Order management
│   │   └── shop.controller.ts    # Admin dashboard views
│   ├── models/               # Business logic / services
│   │   ├── Auth.service.ts       # JWT token management
│   │   ├── Item.service.ts       # Product queries
│   │   ├── Member.service.ts     # User operations
│   │   ├── Order.service.ts      # Order processing
│   │   └── View.service.ts       # View/visit tracking
│   ├── schema/               # Mongoose schemas
│   │   ├── Item.model.ts
│   │   ├── Member.model.ts
│   │   ├── Order.model.ts
│   │   ├── OrderItems.model.ts
│   │   └── View.model.ts
│   ├── libs/
│   │   ├── enums/                # TypeScript enums
│   │   │   ├── item.enum.ts          # Laptop brand, category, status
│   │   │   ├── member.enum.ts        # Member type, status
│   │   │   ├── order.enum.ts         # Order status
│   │   │   └── view.enum.ts          # View categories
│   │   ├── types/                # TypeScript type definitions
│   │   │   ├── common.ts             # Generic types
│   │   │   ├── item.ts               # Product types & interfaces
│   │   │   ├── member.ts             # Member request types
│   │   │   └── order.ts              # Order types
│   │   ├── utils/                # Utilities
│   │   │   └── uploader.ts           # Multer file upload config
│   │   ├── Errors.ts             # Custom error classes
│   │   └── config.ts             # App configuration
│   ├── views/                # EJS templates (admin SSR)
│   │   ├── home.ejs
│   │   ├── items.ejs
│   │   ├── login.ejs
│   │   ├── signup.ejs
│   │   └── users.ejs
│   ├── public/               # Static assets
│   ├── router.ts             # Customer API routes
│   ├── router-admin.ts       # Admin dashboard routes
│   ├── app.ts                # Express app setup
│   └── server.ts             # Entry point
├── uploads/                  # Uploaded files (gitignored)
├── __tests__/                # Jest test suites
├── .env                      # Environment variables (gitignored)
├── jest.config.ts
├── tsconfig.json
└── package.json
```

## API Endpoints

### Public API (`/`)

#### Members

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/member/signup` | No | Register a new user |
| POST | `/member/login` | No | Authenticate user |
| POST | `/member/logout` | Yes | Log out current user |
| GET | `/member/detail` | Yes | Get current user profile |
| POST | `/member/update` | Yes | Update profile (with image upload) |
| GET | `/member/top-users` | No | Get top-rated users |

#### Items

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/item/all` | No | List all products (with pagination & filters) |
| GET | `/item/:id` | Optional | Get single product details |

#### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/order/create` | Yes | Create a new order |
| GET | `/order/all` | Yes | Get current user's orders |
| POST | `/order/update` | Yes | Update an order |

### Admin Dashboard (`/admin`)

#### Shop Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/login` | No | Show login page |
| POST | `/admin/login` | No | Process admin login |
| GET | `/admin/signup` | No | Show signup page |
| POST | `/admin/signup` | No | Process admin signup (with image) |
| GET | `/admin/logout` | Yes | Log out admin |

#### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/item/all` | Shop | View all products (SSR) |
| POST | `/admin/item/create` | Shop | Create product (multipart, up to 5 images) |
| POST | `/admin/item/update` | Shop | Update product status |

#### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/user/all` | Shop | View all users (SSR) |
| POST | `/admin/user/update` | Shop | Update user status |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Xushnudbek76/X-laptop.git
cd X-laptop
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
PORT=3003
MONGO_URI=mongodb://localhost:27017/x-laptop
SECRET_TOKEN=your-secret-token-here
JWT_SECRET=your-jwt-secret-here
SESSION_SECRET=your-session-secret-here
AUTH_TIMER=10800000
```

4. **Start the development server**

```bash
npm run start:dev
```

The application will be available at:
- **API**: `http://localhost:3003`
- **Admin Dashboard**: `http://localhost:3003/admin`

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

## Data Models

### Member

| Field | Type | Description |
|-------|------|-------------|
| memberType | Enum (USER, SHOP) | Account type |
| memberStatus | Enum (ACTIVE, BLOCK, DELETE) | Account status |
| memberNick | String | Display name |
| memberPhone | String | Phone number |
| memberPassword | String (hashed) | BCrypted password |
| memberAddress | String | Location |
| memberDesc | String | Bio/description |
| memberImage | String | Profile image path |
| memberPoints | Number | Loyalty points |
| memberLikes | Number | Total likes received |
| memberCompletedOrders | Number | Completed order count |

### Item (Laptop)

| Field | Type | Description |
|-------|------|-------------|
| laptopStatus | Enum | Product visibility/status |
| laptopCategory | Enum | Category (e.g., gaming, business) |
| laptopBrand | Enum | Brand (e.g., Apple, Dell, HP) |
| laptopName | String | Product name |
| laptopPrice | Number | Selling price |
| laptopRam | Number | RAM in GB |
| laptopStorage | Number | Storage in GB |
| laptopDesc | String | Product description |
| laptopImages | String[] | Image paths (up to 5) |
| laptopLikes | Number[] | Array of member IDs who liked |
| laptopViews | Number | View count |
| laptopSold | Number | Units sold |

### Order

| Field | Type | Description |
|-------|------|-------------|
| orderStatus | Enum | Current order status |
| orderTotal | Number | Total amount |
| orderDelivery | Number | Delivery address |
| memberId | ObjectId | Reference to member |
| orderItems | Array | Line items with quantities |

## User Roles

| Role | Description |
|------|-------------|
| **USER** | Regular customer — can browse, order, review, like |
| **SHOP** | Admin — full access to dashboard, product & user management |

## Product Statuses

| Status | Description |
|--------|-------------|
| PAUSE | Draft/unpublished |
| HOLD | Temporarily unavailable |
| PROCESS | Active/available |
| DELETE | Soft-deleted |
| SOLD_OUT | Out of stock |

## License

ISC

## Author

Xushnudbek (HAMILTON)

## Repository

https://github.com/Xushnudbek76/X-laptop
