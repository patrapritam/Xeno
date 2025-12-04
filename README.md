# Shopify Data Ingestion & Insights Service

A multi-tenant service to ingest data from Shopify and visualize insights.

## Features
- **Multi-tenancy**: Support for multiple Shopify stores with data isolation.
- **Data Ingestion**: Sync Products, Orders, and Customers from Shopify Admin API.
- **Insights Dashboard**: Visualize Revenue, Order Trends, and Top Customers.
- **Tech Stack**: Node.js, Express, Prisma, SQLite (Dev) / PostgreSQL (Prod), Next.js, Tailwind CSS.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Backend Setup
1.  Navigate to `backend`:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Initialize Database:
    ```bash
    npx prisma migrate dev --name init
    ```
4.  Start Server:
    ```bash
    npm run dev
    ```
    Server runs on `http://localhost:3001`.

### Frontend Setup
1.  Navigate to `frontend`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start App:
    ```bash
    npm run dev
    ```
    App runs on `http://localhost:3000`.

## Usage
1.  Open `http://localhost:3000`.
2.  Click **"Register a new store"**.
3.  Enter your Shopify Store details:
    - **Name**: My Store
    - **Shopify Domain**: `your-store.myshopify.com`
    - **Access Token**: Admin API Access Token (Scopes: `read_products`, `read_orders`, `read_customers`)
    - **Email**: your@email.com
4.  Copy the generated **Tenant ID**.
5.  Login with the Tenant ID.
6.  Click **"Sync Data"** on the dashboard to fetch data from Shopify.

## API Endpoints

### Tenants
- `POST /api/tenants/onboard`: Register a new tenant.
- `GET /api/tenants`: List tenants.

### Ingestion
- `POST /api/ingest/sync`: Trigger data sync (Requires `x-tenant-id` header).

### Dashboard
- `GET /api/dashboard/stats`: Aggregated stats.
- `GET /api/dashboard/orders-trend`: Order trends over time.
- `GET /api/dashboard/top-customers`: Top 5 customers by spend.

## Deployment

### Vercel
This project is configured for deployment on Vercel.

1.  **Push to GitHub**: Ensure your code is pushed to a GitHub repository.
2.  **Import Project**: In Vercel, import the repository.
3.  **Environment Variables**: Add the following variables in Vercel Project Settings:
    - `PRISMA_DATABASE_URL`: Connection string for Vercel Postgres (Pooling).
    - `POSTGRES_URL`: Connection string for Vercel Postgres (Non-pooling).
    - `NEXT_PUBLIC_API_URL`: URL of your deployed backend (e.g., `https://your-app.vercel.app/api`).
4.  **Database**:
    - Create a Vercel Postgres database and link it to the project.
    - The `postinstall` script will automatically generate the Prisma Client.
5.  **Deploy**: Click "Deploy".

## Environment Variables

| Variable | Description | Required |
| :--- | :--- | :--- |
| `DATABASE_URL` / `PRISMA_DATABASE_URL` | PostgreSQL connection string (Pooling) | Yes (Prod) |
| `POSTGRES_URL` | PostgreSQL connection string (Direct) | Yes (Prod) |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

