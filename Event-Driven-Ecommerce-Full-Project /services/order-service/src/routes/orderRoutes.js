const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { connectProducer, sendOrderCreatedEvent } = require('../kafka');

connectProducer();

router.post('/', async (req, res) => {
  try {
    const { customerName, amount } = req.body;
    const order = await Order.create({
      orderId: Date.now().toString(),
      customerName,
      amount
    });

    // ✅ Send event to Kafka
    await sendOrderCreatedEvent(order);

    res.status(201).json(order);
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
