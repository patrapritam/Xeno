# Shopify Setup Guide: Getting Your Credentials

To run this project, you need a **Shop Domain** and an **Admin API Access Token**. Follow these steps to generate them.

## 1. Create a Shopify Partner Account
If you don't have one already:
1.  Go to [partners.shopify.com](https://partners.shopify.com/).
2.  Sign up for a free account.

## 2. Create a Development Store
1.  Log in to your Partner Dashboard.
2.  Click **Stores** in the left sidebar.
3.  Click **Add store** > **Create development store**.
4.  Choose **Create a store to test and build**.
5.  Enter a unique store name (e.g., `my-test-store-123`).
6.  Select **Developer preview** if you want new features (optional, usually not needed).
7.  Click **Create development store**.

## 3. Generate Admin API Credentials
We will use a **Custom App** to get an access token directly. This is the simplest way for backend services.

1.  In your new store's Admin Dashboard (e.g., `https://admin.shopify.com/store/your-store-name`), go to **Settings** (bottom left).
2.  Click **Apps and sales channels** in the sidebar.
3.  Click **Develop apps** (you might need to click "Allow custom app development" first if it's your first time).
4.  Click **Create an app**.
5.  Name it (e.g., "Data Ingestion Service") and select your App developer email.
6.  Click **Create app**.

## 4. Configure API Scopes
1.  In your app details page, click **Configure Admin API scopes**.
2.  Search for and check the following `read` permissions (we only need read access for ingestion):
    *   `read_products`
    *   `read_orders`
    *   `read_customers`
    *   (Optional) `read_analytics` or others if you extend the project.
3.  Click **Save** (top right).

## 5. Install App & Get Token
1.  Click the **API credentials** tab.
2.  Click **Install app** (top right). Confirm by clicking **Install**.
3.  Under **Admin API access token**, click **Reveal token once**.
4.  **COPY THIS TOKEN IMMEDIATELY**. It starts with `shpat_`. You won't be able to see it again.
    *   *This is your `Access Token`.*

## 6. Get Your Shop Domain
1.  Your shop domain is the URL you see in the browser, but specifically the `.myshopify.com` part.
2.  Even if you have a custom domain, the API uses the original `myshopify` domain.
3.  Go to **Settings** > **Domains** to verify it (e.g., `test-store-123.myshopify.com`).

---

## Summary of What You Need
When you run the project and go to the **Onboarding Page**, enter:

*   **Store Name**: Any name you like (e.g., "My Dev Store")
*   **Shopify Domain**: `your-store-name.myshopify.com`
*   **Access Token**: `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
*   **Email**: Your email address
