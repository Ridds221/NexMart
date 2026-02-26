const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  stripePaymentIntentId: { type: String, required: true, unique: true },
  amount: Number,
  status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
