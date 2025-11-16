const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { consumer, connectKafka, sendEvent } = require('./kafka');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected (Inventory Service)'))
  .catch((err) => console.error('❌ MongoDB error:', err));

async function runConsumer() {
  await connectKafka();

  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(`📥 Received event: ${event.type}`);

      if (event.type === 'OrderCreated') {
        const { orderId, amount } = event.data;

        // 🔹 Simulate inventory logic
        const inStock = Math.random() > 0.2; // 80% chance in stock
        if (inStock) {
          console.log(`✅ Inventory reserved for order ${orderId}`);
          await sendEvent('InventoryReserved', { orderId });
        } else {
          console.log(`❌ Inventory failed for order ${orderId}`);
          await sendEvent('InventoryFailed', { orderId });
        }
      }
    },
  });
}

runConsumer();

app.listen(process.env.PORT, () => {
  console.log(`🚀 Inventory Service running on port ${process.env.PORT}`);
});
