const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const tenantMiddleware = require('../middleware/tenantMiddleware');

const prisma = new PrismaClient();

router.use(tenantMiddleware);

// aggregated stats
router.get('/stats', async (req, res) => {
  const tenantId = req.tenant.id;
  try {
    const totalCustomers = await prisma.customer.count({ where: { tenantId } });
    const totalOrders = await prisma.order.count({ where: { tenantId } });
    const totalProducts = await prisma.product.count({ where: { tenantId } });
    const totalRevenue = await prisma.order.aggregate({
      where: { tenantId },
      _sum: { total: true },
    });

    res.json({
      totalCustomers,
      totalOrders,
      totalProducts,
      totalRevenue: totalRevenue._sum.total || 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Orders trend (by date)
router.get('/orders-trend', async (req, res) => {
  const tenantId = req.tenant.id;
  try {
    // Group by date (SQLite doesn't support date_trunc easily in Prisma, so fetching all and grouping in JS for simplicity, or raw query)
    // For scalability, raw query is better, but for this assignment JS grouping is fine for small data.
    // Let's use raw query for better practice if possible, but Prisma + SQLite raw query for date is tricky.
    // I'll fetch last 30 days orders and group in JS.
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: 'asc' },
    });

    const trend = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!trend[date]) trend[date] = { date, orders: 0, revenue: 0 };
      trend[date].orders += 1;
      trend[date].revenue += order.total;
    });

    res.json(Object.values(trend));
  } catch (error) {
    console.error('Trend error:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Top 5 customers
router.get('/top-customers', async (req, res) => {
  const tenantId = req.tenant.id;
  try {
    const topCustomers = await prisma.customer.findMany({
      where: { tenantId },
      orderBy: { totalSpent: 'desc' },
      take: 5,
    });
    res.json(topCustomers);
  } catch (error) {
    console.error('Top customers error:', error);
    res.status(500).json({ error: 'Failed to fetch top customers' });
  }
});

module.exports = router;
