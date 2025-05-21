const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    // صفی که پیام‌ها را گوش می‌دهیم، باید همان 'user_notifications' باشد
    await channel.assertQueue('userSaveName');

    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
}

function consumeQueue(onMessage) {
  if (!channel) {
    console.error('RabbitMQ channel is not initialized');
    return;
  }
  channel.consume('userSaveName', (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      onMessage(content);
      channel.ack(msg);
    }
  });
}

module.exports = { connectRabbitMQ, consumeQueue };
