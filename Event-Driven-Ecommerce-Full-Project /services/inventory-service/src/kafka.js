const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');

dotenv.config();

const kafka = new Kafka({
  clientId: 'inventory-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'inventory-group' });
const producer = kafka.producer();

async function connectKafka() {
  await producer.connect();
  await consumer.connect();
  console.log('✅ Kafka connected (Inventory Service)');
}

async function sendEvent(type, data) {
  await producer.send({
    topic: 'order-events',
    messages: [{ value: JSON.stringify({ type, data }) }]
  });
  console.log(`📤 Sent ${type} event`);
}

module.exports = { consumer, connectKafka, sendEvent };
