const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.use('/api/orders', orderRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Starting Order Service...`);
  console.log(`💡 Order Service running on port ${process.env.PORT}`);
});
