const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');

dotenv.config();

// Create Kafka client
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

// Create a producer
const producer = kafka.producer();

// Connect the producer to Kafka
async function connectProducer() {
  try {
    await producer.connect();
    console.log('✅ Kafka producer connected');
  } catch (err) {
    console.error('❌ Error connecting Kafka producer:', err);
  }
}

// Send "OrderCreated" event
async function sendOrderCreatedEvent(order) {
  try {
    await producer.send({
      topic: 'order-events',
      messages: [
        {
          key: order.orderId,
          value: JSON.stringify({
            type: 'OrderCreated',
            data: order
          })
        }
      ]
    });
    console.log(`📤 Sent OrderCreated event for Order ID: ${order.orderId}`);
  } catch (err) {
    console.error('❌ Failed to send Kafka event:', err);
  }
}

module.exports = { connectProducer, sendOrderCreatedEvent };
