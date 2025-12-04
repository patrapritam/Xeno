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
