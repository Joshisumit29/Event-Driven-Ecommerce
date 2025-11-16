const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'CREATED' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'orders' }); // ✅ this ensures data goes into the "orders" collection

module.exports = mongoose.model('Order', orderSchema);
