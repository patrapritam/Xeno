const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const ShopifyService = require('../services/shopifyService');
const tenantMiddleware = require('../middleware/tenantMiddleware');

const prisma = require('../lib/prisma');

router.use(tenantMiddleware);

router.post('/sync', async (req, res) => {
  if (!prisma) {
    return res.status(500).json({ error: 'Database connection failed. Check server logs and environment variables.' });
  }
  const tenant = req.tenant;
  const shopify = new ShopifyService(tenant.shopifyDomain, tenant.accessToken);

  try {
    console.log(`Starting sync for tenant: ${tenant.name}`);

    // 1. Ingest Customers
    const customers = await shopify.getCustomers();
    console.log(`Fetched ${customers.length} customers`);
    for (const cust of customers) {
      await prisma.customer.upsert({
        where: { id: String(cust.id) },
        update: {
          firstName: cust.first_name,
          lastName: cust.last_name,
          email: cust.email,
          totalSpent: parseFloat(cust.total_spent || 0),
          updatedAt: new Date(),
        },
        create: {
          id: String(cust.id),
          firstName: cust.first_name,
          lastName: cust.last_name,
          email: cust.email,
          totalSpent: parseFloat(cust.total_spent || 0),
          tenantId: tenant.id,
        },
      });
    }

    // 2. Ingest Products
    const products = await shopify.getProducts();
    console.log(`Fetched ${products.length} products`);
    for (const prod of products) {
      await prisma.product.upsert({
        where: { id: String(prod.id) },
        update: {
          title: prod.title,
          price: parseFloat(prod.variants[0]?.price || 0),
          updatedAt: new Date(),
        },
        create: {
          id: String(prod.id),
          title: prod.title,
          price: parseFloat(prod.variants[0]?.price || 0),
          tenantId: tenant.id,
        },
      });
    }

    // 3. Ingest Orders
    const orders = await shopify.getOrders();
    console.log(`Fetched ${orders.length} orders`);
    for (const ord of orders) {
      await prisma.order.upsert({
        where: { id: String(ord.id) },
        update: {
          total: parseFloat(ord.total_price),
          currency: ord.currency,
          customerId: ord.customer ? String(ord.customer.id) : null,
          ingestedAt: new Date(),
        },
        create: {
          id: String(ord.id),
          total: parseFloat(ord.total_price),
          currency: ord.currency,
          customerId: ord.customer ? String(ord.customer.id) : null,
          tenantId: tenant.id,
          createdAt: new Date(ord.created_at),
        },
      });
    }

    res.json({ message: 'Sync completed successfully', stats: {
      customers: customers.length,
      products: products.length,
      orders: orders.length
    }});

  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync data', details: error.message });
  }
});

module.exports = router;
