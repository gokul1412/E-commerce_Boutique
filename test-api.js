const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3000/api';
let authToken = null;
let userId = null;
let productId = null;
let orderId = null;

// Test user credentials
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Test product data
const testProduct = {
  name: 'Test Product',
  description: 'This is a test product',
  price: 99.99,
  category: 'test',
  image: 'test-image.jpg',
  stock: 10
};

// Test order data
const testOrder = {
  total: 99.99,
  items: []
};

// Helper function to log test results
const logTest = (name, success, data = null, error = null) => {
  console.log(`\n${success ? '✅' : '❌'} ${name}`);
  if (data) console.log('Data:', JSON.stringify(data, null, 2));
  if (error) console.log('Error:', error.message || error);
};

// Run tests sequentially
const runTests = async () => {
  try {
    console.log('\n🚀 Starting API Tests\n');
    
    // 1. Register a new user
    await testRegister();
    
    // 2. Login with the new user
    await testLogin();
    
    // 3. Get user profile
    await testGetProfile();
    
    // 4. Create a new product (admin only)
    await testCreateProduct();
    
    // 5. Get all products
    await testGetProducts();
    
    // 6. Get a single product
    if (productId) await testGetProduct();
    
    // 7. Create a new order
    if (productId) {
      testOrder.items = [{
        product_id: productId,
        qty: 1,
        price: testProduct.price
      }];
      await testCreateOrder();
    }
    
    // 8. Get user orders
    await testGetOrders();
    
    // 9. Get a single order
    if (orderId) await testGetOrder();
    
    console.log('\n🏁 All tests completed!\n');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
};

// Test functions
const testRegister = async () => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, testUser);
    userId = response.data.user.id;
    logTest('Register User', true, response.data);
    return response.data;
  } catch (error) {
    logTest('Register User', false, null, error.response?.data || error);
    // If user already exists, continue with tests
    console.log('Continuing tests assuming user already exists...');
  }
};

const testLogin = async () => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = response.data.token;
    userId = response.data.user.id;
    logTest('Login', true, response.data);
    return response.data;
  } catch (error) {
    logTest('Login', false, null, error.response?.data || error);
    throw error; // Stop tests if login fails
  }
};

const testGetProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Get Profile', true, response.data);
    return response.data;
  } catch (error) {
    logTest('Get Profile', false, null, error.response?.data || error);
  }
};

const testCreateProduct = async () => {
  try {
    const response = await axios.post(`${API_URL}/products`, testProduct, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    productId = response.data.productId;
    logTest('Create Product', true, response.data);
    return response.data;
  } catch (error) {
    logTest('Create Product', false, null, error.response?.data || error);
    // Try to get a product ID from existing products
    await testGetProducts();
  }
};

const testGetProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    logTest('Get All Products', true, { count: response.data.products.length });
    
    // If we don't have a product ID yet, use the first product
    if (!productId && response.data.products.length > 0) {
      productId = response.data.products[0].id;
      console.log(`Using existing product ID: ${productId}`);
    }
    
    return response.data;
  } catch (error) {
    logTest('Get All Products', false, null, error.response?.data || error);
  }
};

const testGetProduct = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    logTest('Get Single Product', true, response.data);
    return response.data;
  } catch (error) {
    logTest('Get Single Product', false, null, error.response?.data || error);
  }
};

const testCreateOrder = async () => {
  try {
    const response = await axios.post(`${API_URL}/orders`, testOrder, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    orderId = response.data.orderId;
    logTest('Create Order', true, response.data);
    return response.data;
  } catch (error) {
    logTest('Create Order', false, null, error.response?.data || error);
  }
};

const testGetOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Get User Orders', true, { count: response.data.orders.length });
    
    // If we don't have an order ID yet, use the first order
    if (!orderId && response.data.orders.length > 0) {
      orderId = response.data.orders[0].id;
      console.log(`Using existing order ID: ${orderId}`);
    }
    
    return response.data;
  } catch (error) {
    logTest('Get User Orders', false, null, error.response?.data || error);
  }
};

const testGetOrder = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Get Single Order', true, response.data);
    return response.data;
  } catch (error) {
    logTest('Get Single Order', false, null, error.response?.data || error);
  }
};

// Run the tests
runTests();