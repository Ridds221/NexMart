const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const router = express.Router();

// Cursor-based pagination + Text search
router.get('/', async (req, res) => {
  try {
    const { page = { size: 20 }, cursor, search, category, maxPrice } = req.query;
    const pageSize = parseInt(page.size);
    
    let query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (maxPrice) query.price = { $lte: parseInt(maxPrice) };
    
    const cursorObj = cursor ? { _id: mongoose.Types.ObjectId(cursor) } : {};
    
    const products = await Product
      .find({ ...query, ...cursorObj })
      .select('name price category images')
      .sort({ _id: -1 })
      .limit(pageSize + 1)
      .lean();
    
    const hasNext = products.length > pageSize;
    const data = hasNext ? products.slice(0, -1) : products;
    const nextCursor = hasNext ? products[pageSize]._id.toString() : null;
    
    res.json({
      page: { size: pageSize, cursor: nextCursor },
      data,
      hasNext,
      filters: { search, category, maxPrice }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
