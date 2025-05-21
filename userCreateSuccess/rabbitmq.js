const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('userCreateSuccess', {durable: false,autoDelete: true });
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
}

function consumeQueue(onMessage) {
  if (!channel) 
    return console.error('RabbitMQ channel is not initialized');
  
  channel.consume('userCreateSuccess', (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      onMessage(content);
      channel.ack(msg);
    }
  });
  
}

module.exports = { connectRabbitMQ, consumeQueue};