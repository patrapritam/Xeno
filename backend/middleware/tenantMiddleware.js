const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tenantMiddleware = async (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  
  // Allow onboarding without tenant ID
  if (req.path === '/api/tenants/onboard') {
    return next();
  }

  if (!tenantId) {
    return res.status(400).json({ error: 'x-tenant-id header is required' });
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = tenantMiddleware;
