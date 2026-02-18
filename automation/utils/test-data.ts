/**
 * Test Data for E2E Tests
 * Contains credentials, product data, and other test fixtures
 */

export const TEST_USERS = {
    admin: {
        email: 'admin@lourdesgarden.com',
        password: 'Admin123!',
        role: 'SUPER_ADMIN',
    },
    customer: {
        email: 'customer@example.com',
        password: 'Customer123!',
        role: 'CUSTOMER',
    },
};

export const TEST_PRODUCTS = {
    validProduct: {
        name: 'Test Organic Mango',
        sku: 'TEST-MANGO-001',
        basePrice: 100,
        retailPrice: 150,
        description: 'Premium organic mango from our farm',
        isOrganic: true,
        isFeatured: false,
        stock: 100,
    },
    outOfStockProduct: {
        name: 'Out of Stock Product',
        sku: 'TEST-OOS-001',
        basePrice: 50,
        retailPrice: 75,
        stock: 0,
    },
};

export const TEST_ADDRESSES = {
    shipping: {
        fullName: 'John Doe',
        phone: '+919876543210',
        addressLine1: '123 Farm Road',
        addressLine2: 'Near Temple',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        postalCode: '641001',
        country: 'India',
        type: 'SHIPPING',
    },
    billing: {
        fullName: 'John Doe',
        phone: '+919876543210',
        addressLine1: '456 Main Street',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600001',
        country: 'India',
        type: 'BILLING',
    },
};

export const WAIT_TIME = {
    short: 1000,
    medium: 3000,
    long: 5000,
};

export const ROUTES = {
    home: '/',
    login: '/login',
    register: '/register',
    adminDashboard: '/admin/dashboard',
    adminProducts: '/admin/products',
    productNew: '/admin/products/new',
    cart: '/cart',
    checkout: '/checkout',
    about: '/about',
};
