const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

const createOrderWithInventoryUpdate = async (orderData, session) => {
  try {
    // Update inventory for all items
    for (const item of orderData.items) {
      await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }
    
    // Create order
    const order = new Order(orderData);
    await order.save({ session });
    
    return order;
  } catch (error) {
    throw new Error(`Transaction failed: ${error.message}`);
  }
};

module.exports = { createOrderWithInventoryUpdate };
