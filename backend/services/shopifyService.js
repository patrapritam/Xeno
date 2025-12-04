const axios = require('axios');

class ShopifyService {
  constructor(shopDomain, accessToken) {
    this.shopDomain = shopDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    this.accessToken = accessToken;
    this.baseUrl = `https://${shopDomain}/admin/api/2024-01`;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });
  }

  async getProducts() {
    try {
      const response = await this.client.get('/products.json');
      return response.data.products;
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
      throw error;
    }
  }

  async getOrders() {
    try {
      const response = await this.client.get('/orders.json?status=any');
      return response.data.orders;
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      throw error;
    }
  }

  async getCustomers() {
    try {
      const response = await this.client.get('/customers.json');
      return response.data.customers;
    } catch (error) {
      console.error('Error fetching customers:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = ShopifyService;
