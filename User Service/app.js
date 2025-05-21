require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const { connectRabbitMQ, sendToQueue } = require('./rabbitmq');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

connectRabbitMQ();

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();

    // ارسال پیام به RabbitMQ
    sendToQueue({ userId: user._id,  name: user.name, email: user.email, action: 'user_created' });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
