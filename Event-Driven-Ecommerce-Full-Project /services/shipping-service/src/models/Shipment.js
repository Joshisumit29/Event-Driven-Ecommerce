const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  orderId: String,
  status: String,
  shippedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shipment', shipmentSchema);
