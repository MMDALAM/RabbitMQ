require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { connectRabbitMQ, consumeQueue } = require('./rabbitmq');
const Name = require('./models/Name');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for name storage'))
  .catch(console.error);

async function start() {
  await connectRabbitMQ();

  consumeQueue(async (message) => {
    try {
      console.log('Received message in name-storage-service:', message);

      // استخراج نام کاربر از پیام
      const userName = message.name || message.email; // فرض کنیم اگر نام نبود ایمیل ذخیره شود

      if (!userName) {
        console.warn('No name or email found in message');
        return;
      }

      // ذخیره در MongoDB
      const nameRecord = new Name({ name: userName });
      await nameRecord.save();
      console.log('Name saved:', userName);
    } catch (error) {
      console.error('Error saving name:', error);
    }
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Name storage service listening on port ${PORT}`);
  start().catch(console.error);
});
