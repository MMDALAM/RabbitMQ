const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('user_notifications');
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
}

function sendToQueue(message) {
  if (!channel) {
    console.error('RabbitMQ channel is not initialized');
    return;
  }
  channel.sendToQueue('user_notifications', Buffer.from(JSON.stringify(message)));
}

module.exports = { connectRabbitMQ, sendToQueue };
