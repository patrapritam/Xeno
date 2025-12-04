# Deployment Guide: Vercel (Full Stack)

This guide explains how to deploy both the **Next.js Frontend** and the **Express Backend** to Vercel.

> [!IMPORTANT]
> **Database Change**: Vercel is "serverless", meaning files (like `dev.db`) are lost after every request. You **MUST** switch to a cloud database like **Vercel Postgres** or **Neon**.

## 1. Prepare Your Project for Vercel

### A. Create `vercel.json`
Create a `vercel.json` file in the root of your project (`New folder/vercel.json`) to tell Vercel how to handle the backend.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

### B. Update Backend for Serverless
Modify `backend/index.js` to export the app instead of listening on a port when running on Vercel.

```javascript
// backend/index.js
// ... imports and app setup ...

// Only listen if NOT running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
```

### C. Update Frontend API URL
In `frontend/src/lib/api.ts`, update the `API_URL` to use the relative path so it works on the deployed domain.

```typescript
// frontend/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
```

## 2. Database Setup (Vercel Postgres)

1.  Go to [vercel.com](https://vercel.com) and create a new project.
2.  Import your GitHub repository.
3.  In the Vercel Project Dashboard, go to **Storage** tab.
4.  Click **Create Database** -> **Postgres**.
5.  Follow the steps to create it.
6.  Once created, go to **Settings** (of the database) -> **.env.local**.
7.  Copy the `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`.

## 3. Configure Prisma for Postgres

### A. Update `schema.prisma`
Change the provider to `postgresql`.

```prisma
// backend/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL") // Uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // Uses direct connection
}
```

### B. Generate Client
Run `npx prisma generate` locally to update the client.

## 4. Deploy

1.  Push your code to GitHub.
2.  Vercel will automatically detect the commit and start building.
3.  **Environment Variables**: Go to Vercel Project Settings -> **Environment Variables**.
    *   Add `POSTGRES_PRISMA_URL` (from step 2).
    *   Add `POSTGRES_URL_NON_POOLING` (from step 2).
    *   Add `Shopify Credentials` (if you hardcoded them, move them to env vars now!).
4.  **Redeploy**: If the build failed due to missing env vars, go to **Deployments** and click **Redeploy**.

## 5. Run Migrations on Vercel
Since you can't run `npx prisma migrate dev` on Vercel easily, you should run it locally against the production DB **OR** add a build command.

**Recommended (easiest):**
1.  Connect your local `backend/.env` to the Vercel Postgres URL.
2.  Run `npx prisma migrate deploy` locally.
    *   This pushes your schema to the production database.

## Verification
1.  Open your Vercel URL (e.g., `https://your-project.vercel.app`).
2.  Try to log in.
3.  Check if data loads.
