const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { consumer, connectKafka, sendEvent } = require('./kafka');
const Payment = require('./models/Payment');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected (Payment Service)'))
  .catch((err) => console.error('❌ MongoDB error:', err));

async function runConsumer() {
  await connectKafka();

  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(`📥 Received event: ${event.type}`);

      if (event.type === 'InventoryReserved') {
        const { orderId } = event.data;

        // Simulate payment success/failure
        const paymentSuccess = Math.random() > 0.3; // 70% success rate
        if (paymentSuccess) {
          const payment = await Payment.create({
            orderId,
            amount: Math.floor(Math.random() * 5000) + 1000,
            status: 'SUCCESS'
          });
          console.log(`✅ Payment authorized for order ${orderId}`);
          await sendEvent('PaymentAuthorized', { orderId, paymentId: payment._id });
        } else {
          const payment = await Payment.create({
            orderId,
            amount: Math.floor(Math.random() * 5000) + 1000,
            status: 'FAILED'
          });
          console.log(`❌ Payment failed for order ${orderId}`);
          await sendEvent('PaymentFailed', { orderId, paymentId: payment._id });
        }
      }
    },
  });
}

runConsumer();

app.listen(process.env.PORT, () => {
  console.log(`🚀 Payment Service running on port ${process.env.PORT}`);
});
