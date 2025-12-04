const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Onboard a new tenant
router.post('/onboard', async (req, res) => {
  const { name, shopifyDomain, accessToken, email } = req.body;
  try {
    const tenant = await prisma.tenant.create({
      data: { name, shopifyDomain, accessToken, email },
    });
    res.json(tenant);
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Failed to onboard tenant' });
  }
});

// List tenants (for dev)
router.get('/', async (req, res) => {
  const tenants = await prisma.tenant.findMany();
  res.json(tenants);
});

module.exports = router;
