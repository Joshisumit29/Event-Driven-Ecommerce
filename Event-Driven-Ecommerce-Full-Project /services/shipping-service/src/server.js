const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { consumer, connectKafka, sendEvent } = require('./kafka');
const Shipment = require('./models/Shipment');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected (Shipping Service)'))
  .catch((err) => console.error('❌ MongoDB error:', err));

async function runConsumer() {
  await connectKafka();

  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(`📥 Received event: ${event.type}`);

      if (event.type === 'PaymentAuthorized') {
        const { orderId } = event.data;

        // Simulate shipping (80% success rate)
        const shipped = Math.random() > 0.2;
        if (shipped) {
          const shipment = await Shipment.create({
            orderId,
            status: 'SHIPPED'
          });
          console.log(`✅ Order ${orderId} shipped successfully`);
          await sendEvent('OrderShipped', { orderId, shipmentId: shipment._id });
        } else {
          const shipment = await Shipment.create({
            orderId,
            status: 'FAILED'
          });
          console.log(`❌ Shipping failed for order ${orderId}`);
          await sendEvent('ShippingFailed', { orderId, shipmentId: shipment._id });
        }
      }
    },
  });
}

runConsumer();

app.listen(process.env.PORT, () => {
  console.log(`🚀 Shipping Service running on port ${process.env.PORT}`);
});
