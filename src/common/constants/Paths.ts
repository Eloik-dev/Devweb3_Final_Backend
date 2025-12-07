export default {
  Base: '/api',
  GenerateToken: {
    Base: '/generatetoken',
    Get: '/',
  },
  Users: {
    Base: '/users',
    Get: '/all',
    GetOne: '/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
    Login: '/login',
    Register: '/register',
  },
  Stocks: {
    Base: '/stock',
    Get: '/all',
    GetById: '/:id',
    GetByStockName: '/stock/:name',
    GetByShortName: '/shortname/:shortName',
    GetByUnitPrice: '/price/:price',
    GetByDispo: '/dispo/:status',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
