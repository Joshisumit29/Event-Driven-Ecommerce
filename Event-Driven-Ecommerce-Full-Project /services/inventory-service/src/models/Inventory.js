const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: String,
  productName: String,
  stock: Number
});

module.exports = mongoose.model('Inventory', inventorySchema);
