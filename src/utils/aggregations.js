const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

// 1. SALES ANALYTICS BY MONTH
const monthlySalesReport = async () => {
  return await Order.aggregate([
    { $match: { status: { $in: ['confirmed', 'delivered'] } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
        avgOrderValue: { $avg: '$totalAmount' }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);
};

// 2. BEST-SELLING PRODUCTS
const topProducts = async () => {
  return await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 }
  ]);
};

// 3. VENDOR REVENUE DASHBOARD
const vendorRevenue = async (vendorId) => {
  return await Order.aggregate([
    { $match: { 
      'items.product': mongoose.Types.ObjectId(vendorId),
      status: { $in: ['confirmed', 'delivered'] }
    }},
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        orders: { $sum: 1 }
      }
    },
    { $group: {
      _id: null,
      totalRevenue: { $sum: '$revenue' },
      totalOrders: { $sum: '$orders' }
    }}
  ]);
};

module.exports = { monthlySalesReport, topProducts, vendorRevenue };
