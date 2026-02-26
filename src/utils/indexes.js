const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Payment = require('../models/Payment');

const createIndexes = async () => {
  console.log('🔨 Creating 5 optimized indexes...');
  
  // 1. COMPOUND INDEX (ESR Rule)
  await Product.collection.createIndex(
    { category: 1, createdAt: -1, price: 1 },
    { name: 'category_date_price_idx' }
  );
  console.log('✅ 1. Compound index created');

  // 2. TEXT INDEX
  await Product.collection.createIndex(
    { name: 'text', description: 'text', tags: 'text' },
    { name: 'product_search_idx' }
  );
  console.log('✅ 2. Text index created');

  // 3. UNIQUE INDEX
  await User.collection.createIndex({ email: 1 }, { unique: true });
  console.log('✅ 3. Unique index created');

  // 4. DOMAIN-SPECIFIC INDEX (Atlas M0 compatible)
  await Order.collection.createIndex({ status: 1 }, { name: 'order_status_idx' });
  console.log('✅ 4. Order status index created');

  // 5. PAYMENT INDEX
  await Payment.collection.createIndex({ status: 1, createdAt: -1 });
  console.log('✅ 5. Payment index created');
};

module.exports = { createIndexes };
